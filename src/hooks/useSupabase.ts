import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Hook base para operações do Supabase
 * Use este hook como base para criar hooks específicos
 */
export function useSupabase<T = any>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  return {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
    supabase,
  }
}
