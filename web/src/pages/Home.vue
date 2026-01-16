<script lang="ts" setup>
import { backend } from '@/utils/backend';
import { onMounted, ref } from 'vue';


type Terrain = {
  id: string,
  nom: string,
  latitude: number,
  longitude: number,
  surface: number,
  surfaceConstructible: number,
  prix: number,
  longueurFacade: number,
  orientationFacade: string,
  userId: string
  photos: { id: string, url: string }[],
}

const terrains = ref<Terrain[]>([])
async function getTerrains() {
  const terrainsRes = await backend.terrains.getAll();
  terrains.value = terrainsRes;
}

onMounted(() => {
  getTerrains();
});

</script>

<template>
  <UContainer class="py-4">
    <div class="mb-4 flex justify-end">
      <UButton label="Ajouter un terrain" icon="i-lucide-plus" />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard v-for="terrain in terrains" :key="terrain.id" :ui="{ header: 'p-0 sm:p-0' }">
        <template #header>
          <div class="h-50 bg-gray-200">
            <img v-if="terrain.photos.length > 0" :src="terrain.photos[0]!.url" class="h-full w-full object-cover" />
          </div>
        </template>

        <div class="space-y-2">
          <h3 class="font-bold text-lg">{{ terrain.nom }}</h3>
          <p><strong>Surface :</strong> {{ terrain.surface }} m²</p>
          <p><strong>Surface Constructible :</strong> {{ terrain.surfaceConstructible }} m²</p>
          <p><strong>Prix :</strong> {{ terrain.prix }} €</p>
          <p><strong>Longueur de la Façade :</strong> {{ terrain.longueurFacade }} m</p>
          <p><strong>Orientation de la Façade :</strong> {{ terrain.orientationFacade }}</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>