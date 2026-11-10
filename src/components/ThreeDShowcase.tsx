import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  Sparkles, RotateCw, Sun, Moon, Eye, ChevronDown, 
  ChevronUp, Check, Layers, Droplets, ShieldCheck
} from 'lucide-react';

interface ThreeDShowcaseProps {
  initialProductType?: 'serum' | 'cream' | 'cleanser' | 'sunscreen';
  onSelectProduct?: (type: 'serum' | 'cream' | 'cleanser' | 'sunscreen') => void;
}

export const ThreeDShowcase: React.FC<ThreeDShowcaseProps> = ({ 
  initialProductType = 'serum',
  onSelectProduct 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // User UI controls
  const [productType, setProductType] = useState<'serum' | 'cream' | 'cleanser' | 'sunscreen'>(initialProductType);
  const [lightingPreset, setLightingPreset] = useState<'editorial' | 'sunset' | 'midnight' | 'studio'>('editorial');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showBubbles, setShowBubbles] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'formula' | 'glass' | 'ritual'>('formula');
  const [showSpecModal, setShowSpecModal] = useState<boolean>(false);

  // References for mutable animation state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    keyLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    accentPoint: THREE.PointLight;
  } | null>(null);
  const autoRotateRef = useRef<boolean>(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. SCENE & CAMERA SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. STUDIO REFLECTION ENVIRONMENT (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. STUDIO LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe5cfc4, 2.2);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const accentPoint = new THREE.PointLight(0xd4af37, 2.2, 10);
    accentPoint.position.set(0, 3, 3);
    scene.add(accentPoint);

    lightsRef.current = { keyLight, rimLight, ambientLight, accentPoint };

    // 4. CONTACT SHADOW DISK
    const shadowGeo = new THREE.CircleGeometry(1.6, 64);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x221a14,
      transparent: true,
      opacity: 0.16,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.65;
    scene.add(shadowMesh);

    // 5. MASTER MODEL GROUP
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    modelGroupRef.current = masterGroup;

    // 6. BUILD PROCEDURAL 3D SUBJECT BASED ON TYPE
    const buildSubject = (type: 'serum' | 'cream' | 'cleanser' | 'sunscreen') => {
      // Clear old meshes
      while (masterGroup.children.length > 0) {
        const obj = masterGroup.children[0];
        masterGroup.remove(obj);
      }

      if (type === 'serum') {
        // --- 1. SERUM DROPPER BOTTLE (8-part composite) ---
        // A. Heavy Base Glass Bottle
        const bottleGeo = new THREE.CylinderGeometry(0.92, 0.92, 2.5, 64, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xfffaf5,
          transmission: isSoftwareGl ? 0 : 0.93,
          opacity: isSoftwareGl ? 0.4 : 1,
          transparent: true,
          roughness: 0.08,
          ior: 1.52,
          thickness: 1.3,
          specularIntensity: 1.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04
        });
        const bottleMesh = new THREE.Mesh(bottleGeo, glassMat);
        masterGroup.add(bottleMesh);

        // B. Thick Curved Glass Base
        const baseGeo = new THREE.CylinderGeometry(0.92, 0.88, 0.25, 64);
        const baseMesh = new THREE.Mesh(baseGeo, glassMat);
        baseMesh.position.y = -1.35;
        masterGroup.add(baseMesh);

        // C. Inner Liquid Core (Rich Amber Vitamin C / Rose Gold)
        const liquidGeo = new THREE.CylinderGeometry(0.84, 0.84, 2.2, 48);
        const liquidMat = new THREE.MeshStandardMaterial({
          color: 0xf4b18c,
          roughness: 0.15,
          metalness: 0.15,
          transparent: true,
          opacity: 0.88
        });
        const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
        liquidMesh.position.y = -0.15;
        masterGroup.add(liquidMesh);

        // D. Tapered Shoulder Collar
        const shoulderGeo = new THREE.CylinderGeometry(0.48, 0.92, 0.45, 64);
        const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
        shoulderMesh.position.y = 1.45;
        masterGroup.add(shoulderMesh);

        // E. Anisotropic Polished Gold Dropper Ring
        const ringGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.55, 64);
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xd8b248,
          metalness: 0.94,
          roughness: 0.16
        });
        const ringMesh = new THREE.Mesh(ringGeo, goldMat);
        ringMesh.position.y = 1.85;
        masterGroup.add(ringMesh);

        // F. Knurled Grip Micro-Band
        const bandGeo = new THREE.TorusGeometry(0.56, 0.03, 16, 64);
        const bandMesh = new THREE.Mesh(bandGeo, goldMat);
        bandMesh.rotation.x = Math.PI / 2;
        bandMesh.position.y = 1.85;
        masterGroup.add(bandMesh);

        // G. Soft Silicone Dropper Bulb
        const bulbGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.75, 48);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0xfefcf9,
          roughness: 0.55,
          metalness: 0.05
        });
        const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
        bulbMesh.position.y = 2.45;
        masterGroup.add(bulbMesh);

        // H. Inner Glass Pipette Tube
        const pipetteGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 24);
        const pipetteMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.9,
          roughness: 0.1,
          transparent: true
        });
        const pipetteMesh = new THREE.Mesh(pipetteGeo, pipetteMat);
        pipetteMesh.position.y = 0.5;
        masterGroup.add(pipetteMesh);

      } else if (type === 'cream') {
        // --- 2. LUXURY CREAM JAR (6-part composite) ---
        // A. Heavy Crystal Glass Jar
        const jarGeo = new THREE.CylinderGeometry(1.4, 1.35, 1.3, 64);
        const jarGlassMat = new THREE.MeshPhysicalMaterial({
          color: 0xfffcf7,
          transmission: isSoftwareGl ? 0 : 0.9,
          opacity: isSoftwareGl ? 0.45 : 1,
          transparent: true,
          roughness: 0.06,
          thickness: 1.5,
          clearcoat: 1.0
        });
        const jarMesh = new THREE.Mesh(jarGeo, jarGlassMat);
        jarMesh.position.y = -0.5;
        masterGroup.add(jarMesh);

        // B. Velvet White Soufflé Cream Inside
        const creamGeo = new THREE.CylinderGeometry(1.22, 1.2, 0.9, 48);
        const creamMat = new THREE.MeshStandardMaterial({
          color: 0xfffcf9,
          roughness: 0.4,
          metalness: 0.02
        });
        const creamMesh = new THREE.Mesh(creamGeo, creamMat);
        creamMesh.position.y = -0.55;
        masterGroup.add(creamMesh);

        // C. Luxury Rose-Gold Metallic Screw Lid
        const lidGeo = new THREE.CylinderGeometry(1.44, 1.44, 0.55, 64);
        const roseGoldMat = new THREE.MeshStandardMaterial({
          color: 0xd8a47f,
          metalness: 0.92,
          roughness: 0.18
        });
        const lidMesh = new THREE.Mesh(lidGeo, roseGoldMat);
        lidMesh.position.y = 0.4;
        masterGroup.add(lidMesh);

        // D. Chamfered Lid Rim
        const rimGeo = new THREE.TorusGeometry(1.43, 0.04, 16, 64);
        const rimMesh = new THREE.Mesh(rimGeo, roseGoldMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.position.y = 0.65;
        masterGroup.add(rimMesh);

        // E. Embossed Gold Logo Coin Center
        const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.03, 48);
        const coinMat = new THREE.MeshStandardMaterial({
          color: 0xe0b968,
          metalness: 0.95,
          roughness: 0.12
        });
        const coinMesh = new THREE.Mesh(coinGeo, coinMat);
        coinMesh.position.y = 0.69;
        masterGroup.add(coinMesh);

      } else if (type === 'cleanser') {
        // --- 3. FOAMING CLEANSER PUMP (7-part composite) ---
        // A. Tall Sleek Frosted Cylinder
        const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 3.2, 64);
        const frostedMat = new THREE.MeshPhysicalMaterial({
          color: 0xfdfaf6,
          roughness: 0.28,
          transmission: isSoftwareGl ? 0 : 0.8,
          opacity: 0.7,
          transparent: true
        });
        const bodyMesh = new THREE.Mesh(bodyGeo, frostedMat);
        bodyMesh.position.y = -0.3;
        masterGroup.add(bodyMesh);

        // B. Gentle Green Tea Extract Core
        const coreGeo = new THREE.CylinderGeometry(0.78, 0.78, 2.8, 48);
        const teaMat = new THREE.MeshStandardMaterial({
          color: 0xdfede2,
          roughness: 0.25,
          transparent: true,
          opacity: 0.8
        });
        const coreMesh = new THREE.Mesh(coreGeo, teaMat);
        coreMesh.position.y = -0.4;
        masterGroup.add(coreMesh);

        // C. Gold Pump Base Ring
        const pumpBaseGeo = new THREE.CylinderGeometry(0.5, 0.85, 0.4, 48);
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.9,
          roughness: 0.2
        });
        const pumpBaseMesh = new THREE.Mesh(pumpBaseGeo, goldMat);
        pumpBaseMesh.position.y = 1.45;
        masterGroup.add(pumpBaseMesh);

        // D. Dispenser Stem
        const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32);
        const stemMesh = new THREE.Mesh(stemGeo, goldMat);
        stemMesh.position.y = 1.85;
        masterGroup.add(stemMesh);

        // E. Ergonomic Pump Head
        const headGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 32);
        const headMesh = new THREE.Mesh(headGeo, goldMat);
        headMesh.position.y = 2.15;
        masterGroup.add(headMesh);

        // F. Curved Dispensing Nozzle
        const nozzleGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.55, 24);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, goldMat);
        nozzleMesh.rotation.z = Math.PI / 2.8;
        nozzleMesh.position.set(0.35, 2.12, 0);
        masterGroup.add(nozzleMesh);

      } else if (type === 'sunscreen') {
        // --- 4. DAILY SUNSCREEN TUBE (5-part composite) ---
        // A. Sleek Oval Tapered Tube Body
        const tubeGeo = new THREE.CylinderGeometry(0.85, 0.55, 2.8, 64);
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xfffcf7,
          roughness: 0.2,
          metalness: 0.08
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        tubeMesh.scale.set(1.15, 1, 0.75);
        tubeMesh.position.y = 0.4;
        masterGroup.add(tubeMesh);

        // B. Crimp Heat-Sealed Top Fin
        const crimpGeo = new THREE.BoxGeometry(1.9, 0.2, 0.1);
        const goldMat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.92,
          roughness: 0.18
        });
        const crimpMesh = new THREE.Mesh(crimpGeo, goldMat);
        crimpMesh.position.y = 1.85;
        masterGroup.add(crimpMesh);

        // C. Screw Neck Base
        const neckGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.3, 32);
        const neckMesh = new THREE.Mesh(neckGeo, goldMat);
        neckMesh.position.y = -1.1;
        masterGroup.add(neckMesh);

        // D. Octagonal Polished Gold Cap
        const capGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.65, 8);
        const capMesh = new THREE.Mesh(capGeo, goldMat);
        capMesh.position.y = -1.5;
        masterGroup.add(capMesh);
      }
    };

    buildSubject(productType);

    // 7. ORBITING HYDRATION PARTICLES
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    particlesRef.current = particleGroup;

    const pCount = 38;
    const pGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75
    });

    const pData: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; yBase: number }[] = [];
    for (let i = 0; i < pCount; i++) {
      const mesh = new THREE.Mesh(pGeo, pMat);
      const angle = (i / pCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 1.35 + Math.random() * 1.4;
      const yBase = -1.2 + Math.random() * 3.2;
      mesh.position.set(Math.cos(angle) * radius, yBase, Math.sin(angle) * radius);
      particleGroup.add(mesh);
      pData.push({
        mesh,
        angle,
        radius,
        speed: 0.006 + Math.random() * 0.008,
        yBase
      });
    }

    // 8. INTERACTIVE DRAG & MOUSE INERTIA
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.009;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 9. ANIMATION LOOP WITH THREE.MathUtils.damp
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto-rotation when enabled
      if (autoRotateRef.current && !isDragging) {
        targetRotationY += 0.007;
      }

      // Smooth exponential damping
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 7, delta);
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 7, delta);

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.y = currentRotationY;
        modelGroupRef.current.rotation.x = currentRotationX;
        // Natural levitation hover
        modelGroupRef.current.position.y = Math.sin(elapsed * 1.4) * 0.08;
      }

      // Animate floating hydration droplets
      if (particlesRef.current) {
        pData.forEach((p, idx) => {
          p.angle += p.speed;
          p.mesh.position.x = Math.cos(p.angle) * p.radius;
          p.mesh.position.z = Math.sin(p.angle) * p.radius;
          p.mesh.position.y = p.yBase + Math.sin(elapsed * 1.8 + idx) * 0.12;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [productType]);

  // Adjust lights when lightingPreset changes
  useEffect(() => {
    if (!lightsRef.current) return;
    const { keyLight, rimLight, ambientLight, accentPoint } = lightsRef.current;

    if (lightingPreset === 'editorial') {
      ambientLight.color.setHex(0xfff5ea);
      ambientLight.intensity = 1.2;
      keyLight.color.setHex(0xfff7ed);
      keyLight.intensity = 2.8;
      rimLight.color.setHex(0xe5cfc4);
      accentPoint.color.setHex(0xd4af37);
      accentPoint.intensity = 2.2;
    } else if (lightingPreset === 'sunset') {
      ambientLight.color.setHex(0xffe8d6);
      ambientLight.intensity = 1.0;
      keyLight.color.setHex(0xffa86b);
      keyLight.intensity = 3.2;
      rimLight.color.setHex(0xd47a5b);
      accentPoint.color.setHex(0xff8c42);
      accentPoint.intensity = 3.0;
    } else if (lightingPreset === 'midnight') {
      ambientLight.color.setHex(0x1a1926);
      ambientLight.intensity = 0.8;
      keyLight.color.setHex(0xd6d0e8);
      keyLight.intensity = 2.0;
      rimLight.color.setHex(0x9d8bb8);
      accentPoint.color.setHex(0xbfa4d9);
      accentPoint.intensity = 2.5;
    } else if (lightingPreset === 'studio') {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.4;
      keyLight.color.setHex(0xffffff);
      keyLight.intensity = 3.0;
      rimLight.color.setHex(0xdcdcdc);
      accentPoint.color.setHex(0xf3e5ab);
      accentPoint.intensity = 1.8;
    }
  }, [lightingPreset]);

  // Toggle particles visibility
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.visible = showBubbles;
    }
  }, [showBubbles]);

  const switchProduct = (type: 'serum' | 'cream' | 'cleanser' | 'sunscreen') => {
    setProductType(type);
    if (onSelectProduct) {
      onSelectProduct(type);
    }
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] bg-gradient-to-b from-[#FAF6F0] via-[#F6F0E6] to-[#FAF6F0] rounded-2xl overflow-hidden border border-stone-200/80 shadow-inner flex flex-col justify-between">
      
      {/* TOP HEADER: BRAND SPEC & INTERACTIVE BADGE */}
      <div className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200/80 shadow-sm flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[11px] uppercase tracking-widest font-semibold text-stone-800">
            {productType === 'serum' && 'Haute Facial Serum • 30 ml'}
            {productType === 'cream' && 'Ceramide Velvet Cream • 50 g'}
            {productType === 'cleanser' && 'Botanical Cloud Cleanser • 150 ml'}
            {productType === 'sunscreen' && 'Zero Cast SPF 50 Shield • 50 ml'}
          </span>
        </div>

        <button 
          onClick={() => setShowSpecModal(!showSpecModal)}
          className="pointer-events-auto bg-[#1A1815] text-[#FAF7F2] hover:bg-stone-800 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-medium shadow-md transition-all flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Formula Specs</span>
        </button>
      </div>

      {/* SPEC MODAL OVERLAY */}
      {showSpecModal && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Lab Analysis</span>
                <h4 className="text-lg font-serif text-stone-900">
                  {productType === 'serum' && 'Glow Boost Vitamin C Protocol'}
                  {productType === 'cream' && 'Luxury Moisturizing Soufflé'}
                  {productType === 'cleanser' && 'Gentle Foaming Green Tea Wash'}
                  {productType === 'sunscreen' && 'SPF 50 Invisible Water-Gel'}
                </h4>
              </div>
              <button 
                onClick={() => setShowSpecModal(false)}
                className="text-stone-400 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Spec Tabs */}
            <div className="flex border-b border-stone-200 text-xs">
              {(['formula', 'glass', 'ritual'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSpecTab(tab)}
                  className={`pb-2 px-3 font-semibold uppercase tracking-wider ${
                    activeSpecTab === tab 
                      ? 'border-b-2 border-stone-900 text-stone-900' 
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeSpecTab === 'formula' && (
              <div className="text-xs text-stone-600 space-y-2">
                <p>• <strong className="text-stone-900">Actives:</strong> 15% L-Ascorbic Acid + 1% Pure Ferulic Acid + Japanese Citrus Yuzu.</p>
                <p>• <strong className="text-stone-900">Clinical pH:</strong> 3.2 for optimal cutaneous penetration.</p>
                <p>• <strong className="text-stone-900">Efficacy:</strong> 89% of trial participants measured visible hyperpigmentation reduction in 14 days.</p>
              </div>
            )}

            {activeSpecTab === 'glass' && (
              <div className="text-xs text-stone-600 space-y-2">
                <p>• <strong className="text-stone-900">Flacon Material:</strong> 100% recyclable, UV-opaque borosilicate glass with amber core.</p>
                <p>• <strong className="text-stone-900">Pump & Collar:</strong> Anodized champagne gold aluminum, zero phthalates.</p>
                <p>• <strong className="text-stone-900">Dispense Metering:</strong> Calibrated micro-dropper dispensing exact 0.25ml per press.</p>
              </div>
            )}

            {activeSpecTab === 'ritual' && (
              <div className="text-xs text-stone-600 space-y-2">
                <p>• <strong className="text-stone-900">Step 1:</strong> Cleanse with lukewarm water.</p>
                <p>• <strong className="text-stone-900">Step 2:</strong> Press 3–4 drops onto cheekbones, forehead, and jawline.</p>
                <p>• <strong className="text-stone-900">Step 3:</strong> Seal with Lumora Moisturizing Cream & SPF 50 daily.</p>
              </div>
            )}

            <button 
              onClick={() => setShowSpecModal(false)}
              className="w-full py-2 bg-stone-900 text-white rounded text-xs uppercase tracking-wider font-medium hover:bg-stone-800"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* CENTRAL 3D SCENE (100% UNOBSTRUCTED VIEWPORT) */}
      <div 
        ref={mountRef} 
        className="w-full flex-1 cursor-grab active:cursor-grabbing touch-none select-none relative" 
        title="Click and drag to rotate 360°"
      />

      {/* DOCKED COLLAPSIBLE CONTROLS PER THREE.JS GUIDELINES */}
      <div className="z-20 px-4 pb-4 w-full flex flex-col items-center">
        
        {/* Toggle Collapse Pill */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-2 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900 border border-stone-200/90 shadow-sm flex items-center gap-1.5 transition-all"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-stone-800" />
              <span>Show 3D Studio Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-stone-800" />
              <span>Hide Controls (Cinema View)</span>
            </>
          )}
        </button>

        {/* Unified Bottom Control Dock */}
        {!isDockCollapsed && (
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-stone-200/90 shadow-xl space-y-3">
            
            {/* 1. Product Switcher Pills */}
            <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { type: 'serum', label: '1. Facial Serum' },
                  { type: 'cream', label: '2. Barrier Cream' },
                  { type: 'cleanser', label: '3. Face Wash' },
                  { type: 'sunscreen', label: '4. SPF 50 Shield' }
                ] as const
              ).map((item) => (
                <button
                  key={item.type}
                  onClick={() => switchProduct(item.type)}
                  className={`flex-1 min-w-[110px] py-1.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-center ${
                    productType === item.type
                      ? 'bg-[#1A1815] text-white shadow-sm'
                      : 'bg-stone-100/80 text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 2. Studio Lighting & Interactive Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-xs">
              
              {/* Lighting Preset Selector */}
              <div className="flex items-center gap-1.5 text-stone-600">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-medium uppercase tracking-wider hidden sm:inline">Lighting:</span>
                <div className="flex gap-1">
                  {(
                    [
                      { id: 'editorial', label: 'Editorial' },
                      { id: 'sunset', label: 'Sunset' },
                      { id: 'midnight', label: 'Midnight' },
                      { id: 'studio', label: 'Pure White' }
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setLightingPreset(m.id)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                        lightingPreset === m.id
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    autoRotate ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  title="Toggle automatic rotation"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>360° Spin</span>
                </button>

                <button
                  onClick={() => setShowBubbles(!showBubbles)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    showBubbles ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  title="Toggle floating botanical hydration particles"
                >
                  <Droplets className="w-3 h-3 text-amber-600" />
                  <span>Molecules</span>
                </button>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};
