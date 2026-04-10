const REPO_OWNER = 'frederikkaiser-cegtec';
const REPO_NAME = 'cegtec-assets';

const TOKEN_KEY = 'sf-github-token';

export function getGitHubToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setGitHubToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export const ASSET_FOLDERS = [
  { id: 'linkedin', label: 'LinkedIn Posts' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'academy', label: 'Academy' },
  { id: 'slides', label: 'Slides / Präsentationen' },
  { id: 'brand', label: 'Brand' },
  { id: 'misc', label: 'Sonstiges' },
] as const;

export type AssetFolder = (typeof ASSET_FOLDERS)[number]['id'];

interface PushResult {
  success: boolean;
  url?: string;
  rawUrl?: string;
  error?: string;
}

/**
 * Push a base64-encoded image to the cegtec-assets repo via GitHub Contents API.
 */
export async function pushToGitHub(
  folder: AssetFolder,
  filename: string,
  dataUrl: string,
  commitMessage: string,
): Promise<PushResult> {
  const token = getGitHubToken();
  if (!token) {
    return { success: false, error: 'Kein GitHub Token gesetzt. Bitte unter Settings konfigurieren.' };
  }

  // Strip data URL prefix to get raw base64
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  const path = `${folder}/${filename}`;

  // Check if file already exists (need sha for update)
  let sha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64,
          ...(sha ? { sha } : {}),
        }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `GitHub API ${res.status}: ${err.message || res.statusText}` };
    }

    const data = await res.json();
    const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`;

    return {
      success: true,
      url: data.content?.html_url,
      rawUrl,
    };
  } catch (e: any) {
    return { success: false, error: e.message || 'Unbekannter Fehler' };
  }
}

/**
 * Push a JSON string (presentation/template) to cegtec-assets repo.
 */
export async function pushJSONToGitHub(
  folder: AssetFolder,
  filename: string,
  jsonString: string,
  commitMessage: string,
): Promise<PushResult> {
  const token = getGitHubToken();
  if (!token) {
    return { success: false, error: 'Kein GitHub Token gesetzt. Bitte unter Settings konfigurieren.' };
  }

  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  const path = `${folder}/${filename}`;

  let sha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }
  } catch {
    // File doesn't exist yet
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64,
          ...(sha ? { sha } : {}),
        }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `GitHub API ${res.status}: ${err.message || res.statusText}` };
    }

    const data = await res.json();
    const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`;

    return {
      success: true,
      url: data.content?.html_url,
      rawUrl,
    };
  } catch (e: any) {
    return { success: false, error: e.message || 'Unbekannter Fehler' };
  }
}
