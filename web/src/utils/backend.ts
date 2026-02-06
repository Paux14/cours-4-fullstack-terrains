import { ofetch } from 'ofetch'

const backendFetch = ofetch.create({
  baseURL: 'http://localhost:8000',
  onRequest({ options }) {
    const token = localStorage.getItem('token')
    if (token) {
      options.headers.append('Authorization', `Bearer ${token}`)
    }
  },
})

export const backend = {
  auth: {
    register: (params: { username: string; password: string; name: string }) => {
      return backendFetch<{ id: string; username: string; name: string }>('/auth/register', {
        method: 'POST',
        body: params,
      })
    },

    login: (params: { username: string; password: string }) => {
      return backendFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: params,
      })
    },
  },

  terrains: {
    getAll() {
      return backendFetch<
        {
          id: string
          nom: string
          latitude: number
          longitude: number
          surface: number
          surfaceConstructible: number
          prix: number
          longueurFacade: number
          orientationFacade: string
          userId: string
          photos: { id: string; url: string }[]
        }[]
      >('/terrains')
    },

    create(params: {
      nom: string
      latitude: number
      longitude: number
      surface: number
      surfaceConstructible: number
      prix: number
      longueurFacade: number
      orientationFacade: 'NORD' | 'SUD' | 'EST' | 'OUEST'
    }) {
      return backendFetch<Terrain>('/terrains', {
        method: 'POST',
        body: params,
      })
    },

    uploadPhoto(terrainId: string, file: File) {
      const formData = new FormData()
      formData.append('file', file)

      return backendFetch<{ success: boolean }>(`/terrains/${terrainId}/photos`, {
        method: 'POST',
        body: formData,
      })
    },
  },
}

export type Terrain = {
  id: string
  nom: string
  latitude: number
  longitude: number
  surface: number
  surfaceConstructible: number
  prix: number
  longueurFacade: number
  orientationFacade: string
  userId: string
}
