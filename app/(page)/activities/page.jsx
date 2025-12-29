
"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { RotateCcw, Shuffle, Plus, Minus, Box } from 'lucide-react';

const RubiksCubePage = () => {
    const mountRef = useRef(null);
    const [status, setStatus] = useState("Ready");
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Logic Refs
    const sceneRef = useRef(new THREE.Scene());
    const pivotRef = useRef(new THREE.Object3D());
    const cubiesRef = useRef([]);
    const moveHistoryRef = useRef([]);
    const controlsRef = useRef(null);

    // --- Configuration ---
    const CUBE_SIZE = 1;
    const SPACING = 0.05;
    const ANIMATION_SPEED = 300;
    const COLORS = {
        base: 0x111111,
        R: 0xb90000, L: 0xff5900, U: 0xffffff,
        D: 0xffd500, F: 0x009e60, B: 0x0045ad
    };

    const showToast = (msg) => {
        setStatus(msg);
        setTimeout(() => setStatus(""), 2000);
    };

    useEffect(() => {
        const mount = mountRef.current;
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        // Scene Setup
        const scene = sceneRef.current;
        scene.background = new THREE.Color(0x0f172a); // Slate-900

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(6, 6, 8);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.minDistance = 4;
        controls.maxDistance = 12;
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // Sticker Generator
        const createStickerTexture = (colorHex) => {
            const size = 256;
            const canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, size, size);
            ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
            ctx.roundRect(25, 25, 206, 206, 30);
            ctx.fill();
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const materials = [
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.R) }),
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.L) }),
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.U) }),
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.D) }),
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.F) }),
            new THREE.MeshStandardMaterial({ map: createStickerTexture(COLORS.B) }),
        ];

        // Create Cube
        const geometry = new RoundedBoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 3, 0.1);
        cubiesRef.current = [];
        
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const mesh = new THREE.Mesh(geometry, materials.map(m => m.clone()));
                    mesh.position.set(
                        x * (CUBE_SIZE + SPACING),
                        y * (CUBE_SIZE + SPACING),
                        z * (CUBE_SIZE + SPACING)
                    );
                    scene.add(mesh);
                    cubiesRef.current.push(mesh);
                }
            }
        }

        scene.add(pivotRef.current);

        // Animation Loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize Handler
        const handleResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            mount.removeChild(renderer.domElement);
        };
    }, []);

    const rotateLayer = async (axis, index, direction, duration = ANIMATION_SPEED, record = true) => {
        if (isAnimating) return;
        setIsAnimating(true);

        const pivot = pivotRef.current;
        const coordinate = index * (CUBE_SIZE + SPACING);
        const targetCubies = cubiesRef.current.filter(cube => 
            Math.abs(cube.position[axis] - coordinate) < 0.1
        );

        pivot.rotation.set(0, 0, 0);
        targetCubies.forEach(cube => pivot.attach(cube));

        const startTime = performance.now();
        const targetRotation = (Math.PI / 2) * direction * -1;

        await new Promise(resolve => {
            function animateMove() {
                const now = performance.now();
                const progress = Math.min((now - startTime) / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                pivot.rotation[axis] = targetRotation * ease;

                if (progress < 1) requestAnimationFrame(animateMove);
                else resolve();
            }
            animateMove();
        });

        pivot.updateMatrixWorld();
        targetCubies.forEach(cube => {
            sceneRef.current.attach(cube);
            // Snap to grid
            ['x', 'y', 'z'].forEach(a => {
                cube.position[a] = Math.round(cube.position[a] / (CUBE_SIZE + SPACING)) * (CUBE_SIZE + SPACING);
                cube.rotation[a] = Math.round(cube.rotation[a] / (Math.PI / 2)) * (Math.PI / 2);
            });
        });

        if (record) moveHistoryRef.current.push({ axis, index, direction });
        setIsAnimating(false);
    };

    const shuffle = async () => {
        showToast("Shuffling...");
        const axes = ['x', 'y', 'z'];
        for (let i = 0; i < 15; i++) {
            const axis = axes[Math.floor(Math.random() * 3)];
            const index = Math.floor(Math.random() * 3) - 1;
            const dir = Math.random() > 0.5 ? 1 : -1;
            await rotateLayer(axis, index, dir, 100, true);
        }
    };

    const solve = async () => {
        if (moveHistoryRef.current.length === 0) return showToast("Already solved!");
        showToast("Solving...");
        while (moveHistoryRef.current.length > 0) {
            const move = moveHistoryRef.current.pop();
            await rotateLayer(move.axis, move.index, move.direction * -1, 150, false);
        }
        showToast("Solved!");
    };

    return (
        <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-white">
            {/* 3D Canvas */}
            <div ref={mountRef} className="absolute inset-0 z-0" />

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
                {/* Header */}
                <header className="text-center pointer-events-auto">
                    <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        NEO-RUBIK 3D
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest">Interactive Solver</p>
                </header>

                {/* Toast Notification */}
                {status && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 animate-bounce">
                        {status}
                    </div>
                )}

                <div className="flex justify-between items-end">
                    {/* Camera Controls */}
                    <div className="flex flex-col gap-3 pointer-events-auto">
                        <button onClick={() => controlsRef.current.dollyIn(1.2)} className="p-3 bg-white/5 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/10 transition-all">
                            <Plus size={20} />
                        </button>
                        <button onClick={() => controlsRef.current.dollyOut(1.2)} className="p-3 bg-white/5 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/10 transition-all">
                            <Minus size={20} />
                        </button>
                    </div>

                    {/* Logic Controls */}
                    <div className="max-w-xs w-full bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 pointer-events-auto shadow-2xl">
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button onClick={shuffle} disabled={isAnimating} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                                <Shuffle size={18} /> Shuffle
                            </button>
                            <button onClick={solve} disabled={isAnimating} className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 py-3 rounded-xl font-bold transition-colors disabled:opacity-50">
                                <RotateCcw size={18} /> Solve
                            </button>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Manual Rotation</span>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { l: 'L', a: 'y', i: -1, d: 1 }, { l: 'M', a: 'y', i: 0, d: 1 }, { l: 'R', a: 'y', i: 1, d: -1 },
                                    { l: 'U', a: 'x', i: -1, d: -1 }, { l: 'E', a: 'x', i: 0, d: 1 }, { l: 'D', a: 'x', i: 1, d: 1 },
                                    { l: 'F', a: 'z', i: -1, d: 1 }, { l: 'S', a: 'z', i: 0, d: 1 }, { l: 'B', a: 'z', i: 1, d: -1 }
                                ].map((btn) => (
                                    <button
                                        key={btn.l}
                                        onClick={() => rotateLayer(btn.a, btn.i, btn.d)}
                                        className="bg-white/5 hover:bg-white/20 py-2 rounded-lg text-sm font-mono border border-white/5 transition-all"
                                    >
                                        {btn.l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubiksCubePage;