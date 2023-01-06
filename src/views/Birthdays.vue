<template>
  <h3>
    正是你<span v-show="birthdays.data.length > 1">们</span>，点亮了星空。
  </h3>
  <div id="cake"></div>

  <div>
    <div v-for="user in birthdays.data" :key="user.id">
      <div
          class="d-flex align-items-center mt-3"
      >
        <img
            :src="api.avatar + user.email_md5 + '?s=90&d=retro'"
            class="rounded-circle"
            width="48"
            style="object-fit: cover; width: 48px; height: 48px"
        />
        <div class="ms-3">
          <h5 class="mb-0">{{ user.name }}</h5>
          <div class="text-muted animate__animated animate__bounceInRight" v-if="user.id === store.state.user.id">
            这是你
          </div>
        </div>
      </div>

      <hr/>
    </div>

    <!-- 中央按钮 -->
    <div class="d-flex justify-content-center mt-5" v-if="can_next">
      <div class="spinner-border text-primary" role="status" v-if="loading">
        <span class="visually-hidden">Loading...</span>
      </div>

      <button type="button" class="btn btn-primary" @click="load(true)" v-else>
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import http from '../api/http'
import store from '../plugins/store'
import api from '../config/api'
import md5 from 'js-md5'

import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {RGBELoader} from "three/addons/loaders/RGBELoader.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';


const birthdays = ref({data: []})

const page = ref(0)

const can_next = ref(true)

const loading = ref(false)

function load(scroll = false) {
  page.value++

  loading.value = true

  http
      .get('birthdays', {
        params: {
          page: page.value,
        },
      })
      .then((res) => {
        // append
        birthdays.value.data = birthdays.value.data.concat(res.data.data)

        if (!res.data.next_page_url) {
          can_next.value = false
        }
      })
      .finally(() => {
        loading.value = false

        if (scroll) {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 100)
        }
      })
}

function cake() {

  let scene, camera, renderer, cake, controls, gui, stats;

  const white = '#ffffff', black = '#222222';
  const ratio = 1920 / 1080;
  const scale = 0.9;

  let color = white;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    color = black;
  }

  // initialize
  let camera_params = {
    pos_x: 0,
    pos_y: 1.5,
    pos_z: 2.5,
    rot_x: -0.1,
    rot_y: 0,
    rot_z: 0,
  }

  function getElementSize() {
    const dom = document.getElementById('cake');
    let width = dom.clientWidth;
    return width * scale;
  }

  function onWindowResize() {
    const width = getElementSize();
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
    renderer.setSize(width, width / ratio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  function init() {
    // create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(color);
    // new RGBELoader()
    //     .load('src/assets/sky.hdr', function (texture) {
    //       texture.mapping = THREE.EquirectangularReflectionMapping;
    //       // scene.background = texture;
    //       scene.environment = texture;
    //     });

    // create camera
    camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 1000);

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('public/decoder/');
    dracoLoader.preload();

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load('public/assets/models/model.gltf', function (gltf) {
      cake = gltf.scene;
      cake.position.set(0, -0.5, 0);
      scene.add(cake);
    });

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(getElementSize(), getElementSize() / ratio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const light1 = new THREE.PointLight('#eeeeee', 1, 100);
    const light2 = new THREE.PointLight('#eeeeee', 1, 100);
    const light3 = new THREE.PointLight('#eeeeee', 1, 100);
    const light4 = new THREE.PointLight('#eeeeee', 1, 100);
    light1.position.set(-15, 15, -15);
    light2.position.set(15, 15, -15);
    light3.position.set(-15, 15, 15);
    light4.position.set(15, 15, 15);
    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);

    // gui = new GUI();
    // gui.add(camera_params, 'pos_x', -3, 3, 0.001).onChange(render);
    // gui.add(camera_params, 'pos_y', -3, 3, 0.001).onChange(render);
    // gui.add(camera_params, 'pos_z', -3, 3, 0.001).onChange(render);
    // gui.add(camera_params, 'rot_x', -1, 1, 0.001).onChange(render);
    // gui.add(camera_params, 'rot_y', -1, 1, 0.001).onChange(render);
    // gui.add(camera_params, 'rot_z', -1, 1, 0.001).onChange(render);


    // stats = new Stats();

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(camera_params.pos_x, camera_params.pos_y, camera_params.pos_z);
    controls.update();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.001;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = Math.PI / 2;
  }

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    // stats.update();
    render();
  }

  onMounted(() => {
    init();
    animate();

    // document.getElementById('cake').appendChild(stats.dom);
    const canvas = renderer.domElement;
    canvas.style.margin = 'auto';
    document.getElementById('cake').appendChild(canvas);

    window.addEventListener('resize', onWindowResize, false);
    const colorSchema = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchema.addEventListener("change", _ => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        scene.background = new THREE.Color(black);
      } else {
        scene.background = new THREE.Color(white);
      }
      render();
    });
  });
}

load()
cake()
</script>

<style scoped>
#cake {
  margin-bottom: 100px;
}
</style>