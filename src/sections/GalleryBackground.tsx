import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform float uScrollSpeed;
uniform vec2 uMouse;
uniform vec2 uViewportRes;
uniform sampler2D uGalleryTexture;
uniform sampler2D uImages;
uniform float uImageCount;
uniform float uHeartbeat;
uniform float uRotated;

varying vec2 vUv;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 p = (2.0 * fragCoord - uViewportRes) / min(uViewportRes.x, uViewportRes.y);
  
  if (uRotated > 0.5) {
    p = p.yx;
  }
  
  vec3 rd = normalize(vec3(p, 1.0));
  rd *= uHeartbeat;
  
  vec3 ro = vec3(0.0, 0.0, -1.0);
  
  float hitImageIndex = -1.0;
  float minDistance = 1000000.0;
  
  for (int i = 0; i < 100; i++) {
    if (float(i) >= uImageCount) break;
    
    vec4 m = texelFetch(uImages, ivec2(i, 0), 0);
    vec2 center = m.rg;
    float rotation = m.b;
    float scale = m.a;
    
    vec3 box_min = vec3(center - scale * 0.5, -0.05);
    vec3 box_max = vec3(center + scale * 0.5, 0.05);
    
    float tmin = -10000.0;
    float tmax = 10000.0;
    
    float tx1 = (box_min.x - ro.x) / rd.x;
    float tx2 = (box_max.x - ro.x) / rd.x;
    tmin = min(tx1, tx2);
    tmax = max(tx1, tx2);
    
    float ty1 = (box_min.y - ro.y) / rd.y;
    float ty2 = (box_max.y - ro.y) / rd.y;
    float tymin = min(ty1, ty2);
    float tymax = max(ty1, ty2);
    tmin = max(tmin, tymin);
    tmax = min(tmax, tymax);
    
    float tz1 = (box_min.z - ro.z) / rd.z;
    float tz2 = (box_max.z - ro.z) / rd.z;
    float tzmin = min(tz1, tz2);
    float tzmax = max(tz1, tz2);
    tmin = max(tmin, tzmin);
    tmax = min(tmax, tzmax);
    
    if (tmax >= tmin && tmin < minDistance) {
      minDistance = tmin;
      hitImageIndex = float(i);
    }
  }
  
  vec4 col = vec4(0.0);
  
  if (hitImageIndex >= 0.0) {
    vec3 intersectionPoint = ro + minDistance * rd;
    
    for (int i = 0; i < 100; i++) {
      if (float(i) >= uImageCount) break;
      
      vec4 m = texelFetch(uImages, ivec2(i, 0), 0);
      vec2 center = m.rg;
      float rotation = m.b;
      float scale = m.a;
      
      float halfSize = scale * 0.5;
      vec2 localP = intersectionPoint.xy - center;
      vec2 d = abs(localP) - halfSize + vec2(0.01);
      
      float edgeFactor = 1.0 - smoothstep(0.0, 0.05, length(max(d, 0.0)) + min(max(d.x, d.y), 0.0));
      col.rgb *= (1.0 - (1.0 - edgeFactor) * 0.4);
      
      int imageIndex = int(mod(hitImageIndex + float(i), 5.0));
      
      vec2 atlasUV = (intersectionPoint.xy - (center - halfSize)) / scale;
      
      float tileX = float(imageIndex);
      vec2 sampleUV = atlasUV * vec2(0.2, 1.0) + vec2(tileX * 0.2, 0.0);
      
      vec4 textureColor = texture(uGalleryTexture, sampleUV);
      if (i == 0) {
        col = textureColor;
      } else {
        col = mix(col, textureColor, 0.5);
      }
    }
  }
  
  // Vignette
  float vignette = 1.0 - smoothstep(0.5, 1.5, length(p));
  col.rgb *= vignette * 0.6 + 0.4;
  
  gl_FragColor = col;
}
`;

interface GalleryImage {
  position: THREE.Vector3;
  zDepth: number;
  gridPos: { x: number; y: number };
}

function createAtlas(images: HTMLImageElement[]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const imgW = images[0].naturalWidth || 512;
  const imgH = images[0].naturalHeight || 342;
  canvas.width = imgW * 5;
  canvas.height = imgH;
  const ctx = canvas.getContext('2d')!;
  
  for (let i = 0; i < 5; i++) {
    const img = images[i % images.length];
    ctx.drawImage(img, i * imgW, 0, imgW, imgH);
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function GalleryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    animationId: number;
    destroyed: boolean;
  }>({ renderer: null, animationId: 0, destroyed: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    state.destroyed = false;

    // Image paths
    const imagePaths = [
      '/images/img-1.jpg',
      '/images/img-2.jpg',
      '/images/img-3.jpg',
      '/images/img-4.jpg',
      '/images/img-5.jpg',
    ];

    // Load images
    const loadImages = async (): Promise<HTMLImageElement[]> => {
      const promises = imagePaths.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img);
            img.src = src;
          })
      );
      return Promise.all(promises);
    };

    const init = async () => {
      const images = await loadImages();
      if (state.destroyed) return;

      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setPixelRatio(dpr);
      state.renderer = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 1);
      camera.lookAt(0, 0, 0);

      // Create atlas
      const atlasTexture = createAtlas(images);

      // Create data texture for image transforms
      const imageCount = 60;
      const transformData = new Float32Array(imageCount * 4);
      const dataTexture = new THREE.DataTexture(
        transformData,
        imageCount,
        1,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      dataTexture.needsUpdate = true;

      // Create gallery images
      const galleryImages: GalleryImage[] = [];
      const cols = 10;
      const rows = 6;
      for (let i = 0; i < imageCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - cols / 2) * 0.45 + 0.225;
        const y = (row - rows / 2) * 0.35 + 0.175;
        const z = (i / imageCount) * 1.5;
        galleryImages.push({
          position: new THREE.Vector3(x, y, z),
          zDepth: i / imageCount,
          gridPos: { x: col, y: row },
        });
      }

      // Material
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uScrollSpeed: { value: 0.3 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uViewportRes: { value: new THREE.Vector2(1, 1) },
          uGalleryTexture: { value: atlasTexture },
          uImages: { value: dataTexture },
          uImageCount: { value: imageCount },
          uHeartbeat: { value: 1.0 },
          uRotated: { value: 0.0 },
        },
        transparent: true,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      // State
      const pointer = { x: 0, y: 0 };
      const mouseRot = { x: 0, y: 0 };
      let scrollSpeed = 0.3;
      const scrollTarget = { value: 0.3 };

      // Gallery params
      const totalImageSize = 0.25;
      const cumulativeImageSize = 1.1;
      const rowDelayFactor = 0.05;
      const baseMovementAmplitude = 0.004;
      const scrollMovementAmplitude = 0.006;
      const rotationStrength = 1.0;
      const rotationAmplification = 5.0;
      const wobbleStrength = 0.1;
      const heartbeatFrequency = 1.0;
      const heartbeatIntensity = 0.02;
      const mouseRotation = 0.4;
      const mouseRotationEase = 0.03;
      const scrollSmooth = 0.1;
      const maxScrollSpeed = 2.0;

      const updateGallery = (time: number) => {
        // Smooth scroll speed
        scrollSpeed += (Math.abs(scrollTarget.value) * 15 - scrollSpeed) * scrollSmooth;
        scrollSpeed = Math.min(scrollSpeed, maxScrollSpeed);

        // Smooth mouse rotation
        mouseRot.x += (pointer.x * mouseRotation - mouseRot.x) * mouseRotationEase;
        mouseRot.y += (pointer.y * mouseRotation - mouseRot.y) * mouseRotationEase;

        // Heartbeat
        const beat = Math.sin(time * Math.PI * 2 * heartbeatFrequency) * heartbeatIntensity;

        // Update uniforms
        material.uniforms.uTime.value = time;
        material.uniforms.uScrollSpeed.value = scrollSpeed;
        material.uniforms.uMouse.value.set(pointer.x, pointer.y);
        material.uniforms.uHeartbeat.value = 1.0 + beat;

        // Update each image
        for (let i = 0; i < imageCount; i++) {
          const img = galleryImages[i];
          const amplitude = img.zDepth * 2.0 + baseMovementAmplitude + scrollSpeed * scrollMovementAmplitude;
          const delayedTime = time - img.gridPos.y * rowDelayFactor - i * 0.01;

          const x = img.position.x + Math.sin(delayedTime * 0.5 + img.zDepth * 3.0) * (0.03 + img.zDepth * 0.02) + mouseRot.y * (img.zDepth - 0.5) * 0.3;
          const y = img.position.y + Math.cos(delayedTime) * amplitude + Math.sin(delayedTime * 0.3 + img.gridPos.y * 0.5) * 0.02;

          const baseScale = 1.0 + beat + scrollSpeed * 0.1;
          const scaleMultiplier = totalImageSize * Math.pow(cumulativeImageSize, img.zDepth * 10);
          const scaleX = baseScale * scaleMultiplier;

          const rotZ = scrollSpeed * img.zDepth * 0.2 * wobbleStrength + Math.sin(delayedTime * 2 + img.zDepth * 4) * 0.01 * rotationStrength * (1 + img.zDepth * rotationAmplification);

          transformData[i * 4] = x;
          transformData[i * 4 + 1] = y;
          transformData[i * 4 + 2] = rotZ;
          transformData[i * 4 + 3] = scaleX;
        }

        dataTexture.needsUpdate = true;
      };

      // Mouse handler
      const onMouseMove = (e: MouseEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      // Wheel handler
      const onWheel = (e: WheelEvent) => {
        scrollTarget.value += e.deltaY * 0.001;
        scrollTarget.value = Math.max(-1, Math.min(1, scrollTarget.value));
      };

      // Resize handler
      const onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        material.uniforms.uViewportRes.value.set(w, h);
        material.uniforms.uRotated.value = w < h ? 1.0 : 0.0;
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('resize', onResize);
      onResize();

      // Animation loop
      const animate = () => {
        if (state.destroyed) return;
        state.animationId = requestAnimationFrame(animate);
        const time = performance.now() * 0.001;
        updateGallery(time);
        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      state.destroyed = true;
      cancelAnimationFrame(state.animationId);
      if (state.renderer) {
        state.renderer.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
