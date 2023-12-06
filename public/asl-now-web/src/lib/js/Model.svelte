<script lang="ts">
    import {onMount} from 'svelte';
    import * as THREE from 'three';
    import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
    import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
    import {choose, degrees_to_radians} from "$lib/js/Maths";

    export let model: string;

    let el: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let hand: THREE.Object3D;

    const animate = () => {
        requestAnimationFrame(animate);
        if (typeof hand !== "undefined")
            hand.rotation.y += 0.01;
        else
            console.log("Hand not loaded!")
        renderer.render(scene, camera);
    }
    onMount(() => {
        const width = 1080, height = 720;

        camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
        camera.position.set(0, 0, 1.5);

        scene = new THREE.Scene();

        const loader = new OBJLoader();
        loader.load(
            // resource URL
            model,
            // called when resource is loaded
            function (object: THREE.Object3D) {
                hand = object;
                let i = 0;
                hand.traverse(function (child: any) {
                    if (child instanceof THREE.Mesh) {
                        if (i === 0) {
                            child.material = new THREE.MeshMatcapMaterial({
                                color: new THREE.Color(choose([0xe4d5c3, 0xe4d5c2, 0xba874a, 0x735a2f, 0x4e361f]))
                            })
                        }
                        child.scale.set(0.01, 0.01, 0.01);
                        child.rotation.set(degrees_to_radians(90), degrees_to_radians(-90), 0)
                        i++;
                    }
                });
                scene.add(hand);
                animate();
            },
            // called when loading is in progresses
            function (xhr: any) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error: unknown) {
                console.log('An error happened');
                console.error(error);
            }
        );
        renderer = new THREE.WebGLRenderer({antialias: true, canvas: el});
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 0);
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
    });

</script>
<canvas bind:this={el} class="sign-canvas"></canvas>
