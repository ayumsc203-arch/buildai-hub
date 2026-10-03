import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const TOOLS_FILE = path.join(DATA_DIR, 'persistent_tools.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'persistent_submissions.json');

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read persistent tools from disk
export function loadPersistentTools(): any[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(TOOLS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(TOOLS_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('[Storage] Error loading persistent tools:', err);
    return [];
  }
}

// Save or update a persistent tool to disk
export function savePersistentTool(tool: any): void {
  try {
    ensureDataDir();
    const existing = loadPersistentTools();
    const toolObj = typeof tool.toObject === 'function' ? tool.toObject() : tool;
    
    const index = existing.findIndex((t) => t.id === toolObj.id || t.slug === toolObj.slug);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...toolObj, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift({ ...toolObj, createdAt: toolObj.createdAt || new Date().toISOString() });
    }

    fs.writeFileSync(TOOLS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`[Storage] Persisted tool "${toolObj.name}" to disk (${TOOLS_FILE})`);
  } catch (err) {
    console.error('[Storage] Error saving persistent tool:', err);
  }
}

// Remove persistent tool from disk
export function removePersistentTool(toolIdOrSlug: string): void {
  try {
    ensureDataDir();
    const existing = loadPersistentTools();
    const filtered = existing.filter((t) => t.id !== toolIdOrSlug && t.slug !== toolIdOrSlug);
    fs.writeFileSync(TOOLS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error removing persistent tool:', err);
  }
}

// Read persistent submissions from disk
export function loadPersistentSubmissions(): any[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('[Storage] Error loading persistent submissions:', err);
    return [];
  }
}

// Save persistent submission to disk
export function savePersistentSubmission(submission: any): void {
  try {
    ensureDataDir();
    const existing = loadPersistentSubmissions();
    const subObj = typeof submission.toObject === 'function' ? submission.toObject() : submission;

    const index = existing.findIndex((s) => s._id === subObj._id || s.id === subObj.id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...subObj, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift({ ...subObj, createdAt: subObj.createdAt || new Date().toISOString() });
    }

    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    console.log(`[Storage] Persisted submission "${subObj.toolName}" to disk`);
  } catch (err) {
    console.error('[Storage] Error saving persistent submission:', err);
  }
}
