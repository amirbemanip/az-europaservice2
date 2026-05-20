import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AuditResult {
  status: string;
  projekt: string;
  gesamt_wert?: number;
  reason?: string;
  positionen_details?: Array<{
    position_id: string;
    z3_verification: {
      is_safe: boolean;
      requires_conditional_clause: boolean;
      conditional_clause: string | null;
      reason: string;
    }
  }>;
}

function App() {
  const [vertragJson, setVertragJson] = useState(`{
  "projekt_name": "Sanierung Projekt Alpha",
  "positionen": [
    {
      "id": "01.01.01",
      "beschreibung": "Die alte Wand im Keller abreißen",
      "menge": 25.5,
      "einheit": "m2",
      "ep": {
        "lohn": 10.0,
        "stoffe": 0.0,
        "geraete": 5.0,
        "sonstiges": 0.0,
        "gesamt": 15.0
      }
    }
  ]
}`);

  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = JSON.parse(vertragJson);
      // Im echten Tauri-Umfeld würde hier der lokale Python-Prozess aufgerufen.
      const res = await fetch('http://localhost:8000/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ status: 'ERROR', projekt: 'N/A', reason: e.toString() });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-red-500">AZ-Europa Service GmbH</h1>
        <p className="text-slate-400 mt-2">Level 5 Autonomous VOB Legal &amp; Financial Audit Engine</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Vertragseingabe (JSON)</CardTitle>
            <CardDescription className="text-slate-400">Geben Sie die LV-Datenstrukturen ein.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono h-[400px] bg-slate-950 border-slate-800 text-slate-300"
              value={vertragJson}
              onChange={(e) => setVertragJson(e.target.value)}
            />
            <Button
              onClick={runAudit}
              disabled={loading}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Audit läuft (Z3 Solver)...' : 'Mathematisches Audit Starten'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Z3 Theorem Prover Ergebnis</CardTitle>
            <CardDescription className="text-slate-400">Deterministische Evaluierung &amp; Bedingungsprüfung</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && <div className="text-slate-500 italic">Noch kein Audit durchgeführt. Warten auf Eingabe...</div>}

            {result && result.status === 'REJECTED' && (
              <Alert variant="destructive" className="bg-red-950 border-red-900 text-red-200">
                <AlertTitle>HARD STOP - AUDIT FEHLGESCHLAGEN</AlertTitle>
                <AlertDescription>{result.reason}</AlertDescription>
              </Alert>
            )}

            {result && (result.status === 'APPROVED_CLEAN' || result.status === 'APPROVED_WITH_CONDITIONS') && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                  <div className="text-sm text-slate-400">Projekt</div>
                  <div className="text-lg font-bold">{result.projekt}</div>
                  <div className="text-sm text-slate-400 mt-2">Gesamtwert</div>
                  <div className="text-lg font-bold">€{result.gesamt_wert?.toFixed(2)}</div>
                  <div className="text-sm text-slate-400 mt-2">Sicherheitsstatus</div>
                  <div className={`text-lg font-bold ${result.status === 'APPROVED_CLEAN' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {result.status}
                  </div>
                </div>

                <h3 className="font-semibold text-slate-300 mt-4">Positionsdetails &amp; Injezierte Klauseln:</h3>
                {result.positionen_details?.map((pos, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded border border-slate-800">
                    <div className="font-bold text-slate-200">Pos {pos.position_id}</div>
                    <div className="text-sm text-slate-400 mt-1">Z3 Begründung: {pos.z3_verification.reason}</div>

                    {pos.z3_verification.requires_conditional_clause && (
                      <div className="mt-3 p-3 bg-yellow-950/30 border border-yellow-900/50 rounded">
                        <div className="text-xs font-bold text-yellow-600 mb-1">INJEZIERTE RECHTSKLAUSEL (VOB/B §2):</div>
                        <div className="text-sm text-yellow-500/90 italic">
                          "{pos.z3_verification.conditional_clause}"
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
