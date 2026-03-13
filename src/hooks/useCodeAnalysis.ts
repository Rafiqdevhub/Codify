import { useState, useCallback } from "react";
import {
  codeAnalysisApi,
  CodeAnalysisRequest,
  isApiError,
} from "@/services/api";
import { AnalysisResults } from "@/components/ResultsDisplay";

interface UseCodeAnalysisState {
  isAnalyzing: boolean;
  results: AnalysisResults | null;
  error: string | null;
}

export const useCodeAnalysis = () => {
  const [state, setState] = useState<UseCodeAnalysisState>({
    isAnalyzing: false,
    results: null,
    error: null,
  });

  const analyzeCode = useCallback(async (request: CodeAnalysisRequest) => {
    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const results = await codeAnalysisApi.analyzeText(request);
      setState((prev) => ({ ...prev, results, isAnalyzing: false }));
      return results;
    } catch (error) {
      const errorMessage = isApiError(error)
        ? error.message
        : "An unexpected error occurred during analysis";

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isAnalyzing: false,
      }));
      throw error;
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ isAnalyzing: false, results: null, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    analyzeCode,
    clearResults,
    clearError,
  };
};
