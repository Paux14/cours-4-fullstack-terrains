<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';
import { backend } from '@/utils/backend';
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom du terrain doit contenir au moins 2 caractères'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  surface: z.number().min(1),
  surfaceConstructible: z.number().min(0),
  prix: z.number().min(0),
  longueurFacade: z.number().min(0),
  orientationFacade: z.enum(['NORD', 'SUD', 'EST', 'OUEST']),
})

type FormSchema = z.infer<typeof formSchema>

const form = reactive<Partial<FormSchema>>({})

const selectedPhoto = ref<File | null>(null)

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null
  selectedPhoto.value = file
}

const onSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  const response = await backend.terrains.create(event.data)

  if (selectedPhoto.value) {
    try {
      await backend.terrains.uploadPhoto(response.id, selectedPhoto.value)
    } catch (error) {
      console.error('Erreur lors de l’upload de la photo', error)
    }
  }

  toast.add({
    title: 'Terrain créé',
    description: `Le terrain "${response.nom}" a été créé avec succès.`,
  })

  await router.push('/')
}
</script>

<template>
  <UContainer class="py-4">
    <div class="mb-4">
      <UButton to="/" label="Retour à la liste" variant="ghost" color="neutral" icon="i-lucide-arrow-left" />
    </div>

    <UCard>
      <template #header>
        <h3 class="font-bold text-xl">Créer un nouveau terrain</h3>
      </template>

      <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField name="nom" label="Nom du terrain" required>
          <UInput v-model="form.nom" placeholder="Nom du terrain" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField name="latitude" label="Latitude" required>
            <UInput v-model="form.latitude" type="number" placeholder="Latitude" class="w-full" />
          </UFormField>
          <UFormField name="longitude" label="Longitude" required>
            <UInput v-model="form.longitude" type="number" placeholder="Longitude" class="w-full" />
          </UFormField>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <UFormField name="surface" label="Surface (m²)" required>
            <UInput v-model="form.surface" type="number" placeholder="Surface" class="w-full" />
          </UFormField>
          <UFormField name="surfaceConstructible" label="Surface Constructible (m²)" required>
            <UInput v-model="form.surfaceConstructible" type="number" placeholder="Surface Constructible"
              class="w-full" />
          </UFormField>
        </div>

        <UFormField name="prix" label="Prix (€)" required>
          <UInput v-model="form.prix" type="number" placeholder="Prix" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField name="longueurFacade" label="Longueur de la Façade (m)" required>
            <UInput v-model="form.longueurFacade" type="number" placeholder="Longueur de la Façade" class="w-full" />
          </UFormField>
          <UFormField name="orientationFacade" label="Orientation de la Façade" required>
            <USelect v-model="form.orientationFacade" class="w-full" :items="['NORD', 'SUD', 'EST', 'OUEST']" />
          </UFormField>
        </div>

        <UFormField label="Photo (optionnel)">
          <input type="file" accept="image/*" @change="onFileChange" />
        </UFormField>

        <div>
          <UButton type="submit" color="primary" label="Créer le terrain" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
