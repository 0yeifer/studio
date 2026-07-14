import { defineStore } from "pinia"
import { ref, computed } from "vue"
import app_router from "@/router/app_router"

import useCodeStore from "@/stores/codeStore"

import type { StudioPage } from "@/types/Studio/StudioPage"

const useAppStore = defineStore("appStore", () => {
	const activePage = ref<StudioPage | null>(null)

	const routeObject = computed(() => app_router.currentRoute.value)
	const codeStore = useCodeStore()
	codeStore.setRouteObject(routeObject)
	codeStore.setRouterObject(app_router)

	async function setPageData(page: StudioPage) {
		activePage.value = page
		// Published render carries its resources/variables embedded (guest-safe, no extra RPCs);
		// preview render is authenticated and still fetches them via the list resources.
		const useEmbedded = !window.is_preview
		await codeStore.setPageVariables(page, useEmbedded)
		await codeStore.setPageResources(page, false, useEmbedded)
	}

	return {
		setPageData,
		activePage,
		routeObject,
	}
})

export default useAppStore
