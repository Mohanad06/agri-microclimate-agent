/**
 * Frontend API Service Layer for Agri Microclimate Agent
 *
 * Provides centralized communication with the FastAPI backend,
 * response handling, and normalized error processing.
 */
import axios from 'axios';

// ── 1. Base URL Resolution & Safety Check ────────────────────────────────────

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8000');

// ── 2. Axios Instance Configuration ──────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 90000, // 90s timeout to allow multi-tool agent orchestrator execution (FortyGuard heatmap polling + NASA POWER)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ── 3. Error Normalization Helper ─────────────────────────────────────────────

/**
 * @typedef {Object} ApiErrorDetail
 * @property {string} field - Field name that failed validation
 * @property {string} message - Validation message
 */

/**
 * @typedef {Object} NormalizedApiError
 * @property {string} code - Structured error code (e.g. 'VALIDATION_ERROR', 'INTERNAL_ERROR', 'NETWORK_ERROR', 'TIMEOUT_ERROR')
 * @property {string} message - Human-readable summary message
 * @property {ApiErrorDetail[]} details - List of specific field validation errors (for 422)
 * @property {number|null} status - HTTP status code if available
 */

/**
 * Normalizes Axios/network errors into a predictable structure for UI consumption.
 *
 * @param {Error|import('axios').AxiosError} error
 * @returns {NormalizedApiError}
 */
export function normalizeApiError(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'The server request timed out. Please try again.',
        details: [],
        status: null,
      };
    }

    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the Agri Microclimate backend server. Please verify the backend is running.',
        details: [],
        status: null,
      };
    }

    const { status, data } = error.response;

    // Structured backend error payloads (HTTP 422, HTTP 500)
    if (data && data.error) {
      return {
        code: data.error.code || (status === 422 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'),
        message: data.error.message || 'An error occurred during request processing.',
        details: Array.isArray(data.error.details) ? data.error.details : [],
        status,
      };
    }

    // Default HTTP error fallbacks
    return {
      code: status === 422 ? 'VALIDATION_ERROR' : 'HTTP_ERROR',
      message: `HTTP Error ${status}: ${error.response.statusText || 'Request failed'}`,
      details: [],
      status,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred.',
    details: [],
    status: null,
  };
}

// ── 4. Type Definitions for API Payloads & Responses ─────────────────────────

/**
 * @typedef {Object} HealthResponse
 * @property {'ok'} status
 */

/**
 * @typedef {Object} CropsResponse
 * @property {string[]} crops
 */

/**
 * @typedef {Object} AnalyzePayload
 * @property {string} location - Farm or field location description
 * @property {number} [latitude] - Optional explicit latitude (-90 to 90)
 * @property {number} [longitude] - Optional explicit longitude (-180 to 180)
 * @property {string} crop - Target crop name
 * @property {string} [crop_stage] - Optional growth stage
 * @property {string} question - Agricultural question or goal
 */

/**
 * @typedef {Object} LocationInfo
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {string} address
 */

/**
 * @typedef {Object} ToolCallLog
 * @property {string} tool
 * @property {'success'|'failed'} status
 * @property {string} source
 * @property {string} reference
 * @property {string|null} error
 */

/**
 * @typedef {Object} Finding
 * @property {string} metric
 * @property {number} observed
 * @property {number|Array} threshold
 * @property {'safe'|'violated'|'warning'} status
 * @property {string} chunk_id
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {'LOW'|'HIGH'|'INSUFFICIENT_EVIDENCE'} level
 * @property {string} reasoning
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} text
 * @property {string} source_type
 * @property {string} reference_id
 */

/**
 * @typedef {Object} SourceCitation
 * @property {string} type - 'agronomic' | 'environmental'
 * @property {string} name
 * @property {string} source
 * @property {string} reference
 * @property {string} excerpt
 */

/**
 * @typedef {Object} AnalyzeResponse
 * @property {string} goal
 * @property {'completed'|'partial'} status
 * @property {LocationInfo} location
 * @property {string[]} plan
 * @property {ToolCallLog[]} tool_calls
 * @property {Finding[]} findings
 * @property {RiskAssessment} risk_assessment
 * @property {Recommendation[]} recommendations
 * @property {SourceCitation[]} sources
 * @property {string} audit_trace
 */

// ── 5. API Functions ─────────────────────────────────────────────────────────

/**
 * Checks health status of the backend API.
 * Calls: GET /health
 *
 * @returns {Promise<HealthResponse>}
 */
export async function checkHealth() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Retrieves the list of supported crops dynamically from backend.
 * Calls: GET /crops
 *
 * @returns {Promise<string[]>} List of crop names
 */
export async function getCrops() {
  try {
    const response = await apiClient.get('/crops');
    return response.data.crops || [];
  } catch (error) {
    throw normalizeApiError(error);
  }
}

/**
 * Submits an agricultural goal for risk analysis.
 * Calls: POST /analyze
 *
 * @param {AnalyzePayload} payload
 * @returns {Promise<AnalyzeResponse>}
 */
export async function analyze(payload) {
  try {
    const response = await apiClient.post('/analyze', payload);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export default {
  checkHealth,
  getCrops,
  analyze,
  normalizeApiError,
};
