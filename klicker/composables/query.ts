import { computed, Ref, watch } from 'vue'
import { useKlicker } from './klicker'
import { CubeQuery, CubeResponse, CubeComparingQuery, CubeComparingResponse, CubeQueryFilter, CubeComparingQueryFilter } from '../types'

function hash(query: CubeQuery|CubeComparingQuery): string {
  const hashCode = (s: string) => {
    if (s.length === 0) {
      return 0
    }

    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const chr = s.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0
    }
    return hash
  }

  return hashCode(JSON.stringify(query)).toString()
}

/**
 * Run a query
 */
export const useCubeQuery = (query: Ref<CubeComparingQuery|CubeQuery>, filter?: Ref<CubeComparingQueryFilter|CubeQueryFilter|undefined>) => {
  const { $klicker, useQuery } = useKlicker()

  async function fetch(): Promise<undefined|CubeResponse|CubeComparingResponse> {
    if (!query.value.comparing) {
      return await $klicker.query(query.value, <CubeQueryFilter>filter?.value)
    } else {
      return await $klicker.comparingQuery(<CubeComparingQuery>query.value, <CubeComparingQueryFilter>filter?.value)
    }
  }

  const asyncResponse = useQuery(`klicker-query-${hash(query.value)}`, () => fetch())
  const error = computed(() => asyncResponse.error.value)
  const response = computed(() => asyncResponse.data.value)
  const loading = computed(() => asyncResponse.loading.value)

  const update = () => asyncResponse.refresh()
  watch(query, update)

  return {
    $klicker,
    error,
    response,
    loading,
    update,
  }
}
