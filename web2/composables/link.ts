import { computed, Ref } from 'vue'
import { Config, CubeComparingQuery, CubeQuery } from '@schneefux/klicker/types'
import { useKlicker } from '@schneefux/klicker/composables/klicker'
import { useRoute, useRouter } from '~/composables/compat'

export const useSyncQueryAndRoute = (config: Config, defaultCubeId: string) => {
  const { $klicker } = useKlicker()
  const route = useRoute()
  const router = useRouter()

  return computed({
    get() {
      return $klicker.convertLocationToQuery(config, defaultCubeId, route.value)
    },
    set(q: CubeQuery|CubeComparingQuery) {
      router.replace($klicker.convertQueryToLocation(q))
    }
  })
}

export const useSyncSlicesAndRoute = (defaults: Ref<CubeQuery|CubeComparingQuery>) => {
  const { $klicker } = useKlicker()
  const route = useRoute()
  const router = useRouter()

  return computed({
    get() {
      return {
        ...defaults.value,
        slices: $klicker.convertLocationToSlices(route.value, defaults.value.slices)
      }
    },
    set(q: CubeQuery|CubeComparingQuery) {
      router.replace($klicker.convertSlicesToLocation(q.slices, defaults.value.slices))
    }
  })
}
