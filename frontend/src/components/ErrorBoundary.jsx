import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h1 className="text-[30px] font-bold tracking-tight text-stone-950 dark:text-stone-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-[15px] text-stone-600 dark:text-stone-400 mb-8 leading-relaxed">
              An unexpected error occurred. Try refreshing the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-terra-500 text-white rounded-lg font-semibold text-sm hover:bg-terra-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
            {this.state.error && (
              <pre className="mt-6 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs text-stone-600 dark:text-stone-400 text-left overflow-auto max-h-32">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
