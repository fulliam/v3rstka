import { gsap } from 'gsap';

type JumpOptions = {
  height?: number;
  upDuration?: number;
  downDuration?: number;
  easeUp?: string;
  easeDown?: string;
  onStart?: () => void;
  onComplete?: () => void;
  allowWhileMoving?: boolean;
};

export function useJumpAnimation(
  playerOffsetY: Ref<number>,
  opts?: JumpOptions
) {
  const isJumping = ref(false);
  const options: Required<JumpOptions> = {
    height: opts?.height ?? 150,
    upDuration: opts?.upDuration ?? 0.45,
    downDuration: opts?.downDuration ?? 0.45,
    easeUp: opts?.easeUp ?? 'power2.out',
    easeDown: opts?.easeDown ?? 'bounce.out',
    onStart: opts?.onStart ?? (() => {}),
    onComplete: opts?.onComplete ?? (() => {}),
    allowWhileMoving: opts?.allowWhileMoving ?? false,
  };

  let tl: gsap.core.Timeline | null = null;

  const playJump = () => {
    if (!options.allowWhileMoving && isJumping.value) return;

    isJumping.value = true;
    options.onStart?.();

    if (tl) tl.kill();

    const jumpState = { y: 0 };

    tl = gsap.timeline({
      onComplete: () => {
        playerOffsetY.value = 0;
        isJumping.value = false;
        options.onComplete?.();
      },
    });

    tl.to(jumpState, {
      duration: options.upDuration,
      y: -Math.abs(options.height),
      ease: options.easeUp,
      onUpdate: () => {
        playerOffsetY.value = jumpState.y;
      },
    });

    tl.to(jumpState, {
      duration: options.downDuration,
      y: 0,
      ease: options.easeDown,
      onUpdate: () => {
        playerOffsetY.value = jumpState.y;
      },
    });
  };

  const setJumpPhysics = (heightPx: number, timeUpSeconds: number) => {
    const g = (2 * heightPx) / (timeUpSeconds * timeUpSeconds);
    console.log(`Gravity ≈ ${g.toFixed(0)} px/s²`);

    options.height = heightPx;
    options.upDuration = timeUpSeconds;
    options.downDuration = timeUpSeconds * 1.1;
  };

  onUnmounted(() => {
    if (tl) tl.kill();
  });

  return {
    isJumping,
    playJump,
    setJumpPhysics,
  };
}