export function startAutoResetTimer(studentId, resetFn, duration = 60000) {
    setTimeout(() => {
      resetFn(studentId);
    }, duration); // 1 minute (60000 ms)
  }
  