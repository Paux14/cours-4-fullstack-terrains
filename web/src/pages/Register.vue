<script lang="ts" setup>
import { reactive } from 'vue';
import type { FormSubmitEvent } from '@nuxt/ui';
import z from 'zod';
import { useRouter } from 'vue-router';
import { backend } from '@/utils/backend';

const router = useRouter();

const formSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
})

type formSchema = z.infer<typeof formSchema>

const form = reactive<Partial<formSchema>>({})

const onSubmit = async (event: FormSubmitEvent<formSchema>) => {
  await backend.auth.register(event.data);

  await router.push('/login');
}
</script>

<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <h3 class="font-bold text-xl">Inscription à l'application</h3>
      </template>

      <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField name="username" label="Nom d'utilisateur" required>
          <UInput v-model="form.username" name="username" placeholder="Nom d'utilisateur" class="w-full" />
        </UFormField>
        <UFormField name="password" label="Mot de passe" required>
          <UInput v-model="form.password" name="password" type="password" placeholder="Mot de passe" class="w-full" />
        </UFormField>
        <UFormField name="name" label="Nom complet" required>
          <UInput v-model="form.name" name="name" placeholder="Nom complet" class="w-full" />
        </UFormField>
        <div>
          <UButton type="submit" color="primary" label="S'inscrire" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>