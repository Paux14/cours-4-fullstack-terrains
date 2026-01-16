<script lang="ts" setup>
import { reactive } from 'vue';
import z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useRouter } from 'vue-router';
import { backend } from '@/utils/backend';

const router = useRouter();

const formSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type FormSchema = z.infer<typeof formSchema>;

const form = reactive<Partial<FormSchema>>({
  username: '',
  password: '',
})

const onSubmit = async (event: FormSubmitEvent<FormSchema>) => {
  const { token } = await backend.auth.login(event.data);

  localStorage.setItem('token', token);

  await router.push('/');
};
</script>

<template>
  <UContainer class="py-4">
    <UCard>
      <template #header>
        <h3 class="font-bold text-xl">Connexion à l'application</h3>
      </template>

      <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
        <UFormField name="username" label="Nom d'utilisateur" required>
          <UInput v-model="form.username" placeholder="Nom d'utilisateur" class="w-full" />
        </UFormField>
        <UFormField name="password" label="Mot de passe" required>
          <UInput v-model="form.password" type="password" placeholder="Mot de passe" class="w-full" />
        </UFormField>
        <div>
          <UButton type="submit" color="primary" label="Se connecter" />
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>