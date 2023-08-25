<template>
    <h2>webpack5-vue3-ts</h2>

    <img :src="sImg" alt="小图" srcset="">
    <img :src="bImg" alt="大图" srcset="">

    <div class="smallImg"></div>
    <div class="bigImg"></div>

    <h3>修改App.vue</h3>

    <Demo1/>
</template>

<script setup lang="ts">
import './app.less'

import sImg from '@/assets/imgs/5kb.png';
import bImg from '@/assets/imgs/22kb.png';

import Demo1 from '@/components/demo1.vue'
import Demo2 from '@/components/demo2.vue'


console.log('NODE_ENV==', process.env.NODE_ENV)
console.log('BASE_ENV==', process.env.BASE_ENV)


</script>

<style scoped></style>