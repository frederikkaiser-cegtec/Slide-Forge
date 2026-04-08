import { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Copy, Settings2 } from 'lucide-react';
import {
  ASSET_FOLDERS,
  type AssetFolder,
  pushToGitHub,
  getGitHubToken,
  setGitHubToken,
} from '../../utils/githubPush';

interface Props {
  open: boolean;
  onClose: () => void;
  graphicType: string;
  formatId: string;
  captureImage: () => Promise<string>;
}

export function GitHubPushModal({ open, onClose, graphicType, formatId, captureImage }: Props) {
  const [folder, setFolder] = useState<AssetFolder>('linkedin');
  const [filename, setFilename] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; rawUrl?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Init
  useEffect(() => {
    if (open) {
      setToken(getGitHubToken() || '');
      setFilename(`cegtec-${graphicType}-${formatId}.png`);
      setResult(null);
      setCopied(false);
    }
  }, [open, graphicType, formatId]);

  if (!open) return null;

  const handlePush = async () => {
    // Save token
    if (token) setGitHubToken(token);

    setPushing(true);
    setResult(null);

    try {
      const dataUrl = await captureImage();
      const commitMsg = `Add ${graphicType} graphic (${formatId})`;
      const res = await pushToGitHub(folder, filename, dataUrl, commitMsg);
      setResult(res);
    } catch (e: any) {
      setResult({ success: false, error: e.message });
    } finally {
      setPushing(false);
    }
  };

  const handleCopy = () => {
    if (result?.rawUrl) {
      navigator.clipboard.writeText(result.rawUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-[440px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Upload size={16} className="text-primary" />
            <span className="text-sm font-semibold text-text">Push to GitHub</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-hover text-text-muted">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Token (collapsible) */}
          <div>
            <button
              onClick={() => setShowToken(!showToken)}
              className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text transition-colors"
            >
              <Settings2 size={12} />
              GitHub Token {token ? '(gesetzt)' : '(fehlt)'}
            </button>
            {showToken && (
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="mt-1.5 w-full px-3 py-2 bg-bg border border-border rounded-lg text-xs text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50"
              />
            )}
          </div>

          {/* Folder */}
          <div>
            <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5">
              Ordner
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {ASSET_FOLDERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFolder(f.id)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    folder === f.id
                      ? 'bg-primary text-white'
                      : 'bg-muted/60 text-text-muted hover:text-text hover:bg-muted'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filename */}
          <div>
            <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5">
              Dateiname
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-xs text-text focus:outline-none focus:border-primary/50"
            />
            <p className="text-[10px] text-text-muted/50 mt-1">
              Pfad: {folder}/{filename}
            </p>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-3 rounded-lg border text-xs ${
                result.success
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {result.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Check size={14} />
                    <span className="font-medium">Erfolgreich gepusht!</span>
                  </div>
                  {result.rawUrl && (
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] bg-black/20 px-2 py-1 rounded flex-1 truncate">
                        {result.rawUrl}
                      </code>
                      <button
                        onClick={handleCopy}
                        className="shrink-0 p-1 rounded hover:bg-green-500/20 transition-colors"
                        title="URL kopieren"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-1.5">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{result.error}</span>
                </div>
              )}
            </div>
          )}

          {/* Push Button */}
          <button
            onClick={handlePush}
            disabled={pushing || !token || !filename}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:pointer-events-none text-white text-sm rounded-lg font-medium transition-colors"
          >
            <Upload size={14} />
            {pushing ? 'Pusht...' : 'Push to cegtec-assets'}
          </button>
        </div>
      </div>
    </div>
  );
}
