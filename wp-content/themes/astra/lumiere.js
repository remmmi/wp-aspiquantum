/**
 * Effet "Entrer dans la Lumiere" - WebGL waves
 * Canvas plein ecran avec shader GLSL : vagues concentriques depuis le bouton
 */
(function() {
  'use strict';

  var VERTEX_SRC = [
    'attribute vec2 a_position;',
    'void main() {',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAGMENT_SRC = [
    'precision mediump float;',
    'uniform float u_time;',
    'uniform float u_progress;',
    'uniform vec2 u_origin;',
    'uniform vec2 u_resolution;',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution;',
    '  float aspect = u_resolution.x / u_resolution.y;',
    '  vec2 pos = uv;',
    '  pos.x *= aspect;',
    '  vec2 orig = u_origin;',
    '  orig.x *= aspect;',
    '',
    '  float dist = length(pos - orig);',
    '',
    // Rayon max = diagonale normalisee pour couvrir tout l'ecran
    '  float maxRadius = length(vec2(aspect, 1.0));',
    '  float radius = u_progress * maxRadius * 1.3;',
    '',
    // Large zone de transition pour que les vagues soient visibles
    '  float edgeWidth = 0.45 + 0.08 * sin(u_time * 0.4);',
    '  float edgeStart = max(radius - edgeWidth, 0.0);',
    '',
    // Vagues larges et espacees - frequences basses
    '  float wave1 = sin(dist * 7.0 - u_time * 1.8) * 0.5 + 0.5;',
    '  float wave2 = sin(dist * 5.0 + u_time * 1.2) * 0.5 + 0.5;',
    '  float wave3 = sin(dist * 11.0 - u_time * 2.2) * 0.5 + 0.5;',
    '  float wave4 = sin(dist * 3.5 + u_time * 0.8 + 1.57) * 0.5 + 0.5;',
    '',
    // Couleurs franches et saturees
    '  vec3 violet = vec3(0.65, 0.35, 0.85);',
    '  vec3 violetClair = vec3(0.80, 0.55, 0.92);',
    '  vec3 jaune = vec3(0.95, 0.85, 0.35);',
    '  vec3 jauneClair = vec3(0.98, 0.92, 0.55);',
    '  vec3 blanc = vec3(1.0);',
    '  vec3 rose = vec3(0.90, 0.50, 0.70);',
    '',
    // Mix des couleurs - bandes larges alternees
    '  vec3 waveColor = mix(violet, jaune, wave1);',
    '  waveColor = mix(waveColor, rose, wave2 * 0.4);',
    '  waveColor = mix(waveColor, violetClair, wave3 * 0.5);',
    '',
    // Zone interieure : bandes colorees larges bien marquees
    '  float iw1 = sin(dist * 6.0 - u_time * 1.2) * 0.5 + 0.5;',
    '  float iw2 = sin(dist * 4.0 + u_time * 0.8) * 0.5 + 0.5;',
    '  float innerMix = iw1 * 0.35 + iw2 * 0.25;',
    '  vec3 innerTint = mix(violetClair, jauneClair, iw1);',
    '  innerTint = mix(innerTint, rose, iw2 * 0.3);',
    '  vec3 innerColor = mix(blanc, innerTint, innerMix);',
    '',
    // Alpha et composition
    '  float alpha = 0.0;',
    '  vec3 color = blanc;',
    '',
    '  if (dist < edgeStart) {',
    // Zone couverte : opaque avec bandes colorees
    '    alpha = 0.97;',
    '    color = innerColor;',
    '  } else if (dist < radius) {',
    // Zone de transition : vagues colorees larges
    '    float t = (dist - edgeStart) / edgeWidth;',
    '    float waveMask = wave1 * 0.4 + wave2 * 0.3 + wave4 * 0.3;',
    // Alpha forte, decroit lentement
    '    alpha = mix(0.96, 0.0, t * t * t);',
    '    alpha += waveMask * (1.0 - t) * 0.3;',
    '    alpha = clamp(alpha, 0.0, 1.0);',
    // Couleur : bandes colorees franches
    '    float colorT = smoothstep(0.0, 0.35, t);',
    '    color = mix(innerColor, waveColor, colorT);',
    '    color = mix(color, waveColor, waveMask * 0.5);',
    '  }',
    '',
    '  gl_FragColor = vec4(color, alpha * smoothstep(0.0, 0.005, u_progress));',
    '}'
  ].join('\n');

  // Cubic bezier evaluator (CSS-style control points)
  // Opening: (0.15, 0.85, 0.30, 1.0) - fast burst then decelerate
  // Closing: (0.20, 0.80, 0.35, 1.0) - fast start then decelerate
  function cubicBezier(x1, y1, x2, y2) {
    // Newton-Raphson to find t for a given x, then evaluate y
    return function(x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var t = x; // initial guess
      for (var i = 0; i < 8; i++) {
        var cx = 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
        var dx = 3 * x1 * (1 - t) * (1 - t) + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
        if (Math.abs(dx) < 1e-6) break;
        t -= (cx - x) / dx;
        t = Math.max(0, Math.min(1, t));
      }
      return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
    };
  }

  // Fast burst out, smooth deceleration
  var easeOpen = cubicBezier(0.12, 0.9, 0.25, 1.0);
  // Fast retract, smooth end
  var easeClose = cubicBezier(0.15, 0.8, 0.30, 1.0);

  // State
  var canvas = null;
  var gl = null;
  var program = null;
  var animId = null;
  var startTime = 0;
  var progressTarget = 0; // 0 ou 1
  var progressCurrent = 0;
  var animStart = 0;
  var animDuration = 5000;
  var originX = 0.5;
  var originY = 0.5;
  var uniforms = {};
  var active = false;
  var buttonEl = null;
  var originalText = '';
  var ACTIVE_TEXT = 'SORTIR DE LA LUMIERE';

  function compileShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function initWebGL() {
    canvas = document.createElement('canvas');
    canvas.id = 'lumiere-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(canvas);

    gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) {
      console.error('WebGL non supporte');
      return false;
    }

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return false;

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return false;
    }

    gl.useProgram(program);

    // Quad plein ecran
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uniforms.time = gl.getUniformLocation(program, 'u_time');
    uniforms.progress = gl.getUniformLocation(program, 'u_progress');
    uniforms.origin = gl.getUniformLocation(program, 'u_origin');
    uniforms.resolution = gl.getUniformLocation(program, 'u_resolution');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    resize();
    window.addEventListener('resize', resize);

    return true;
  }

  function resize() {
    if (!canvas || !gl) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(timestamp) {
    if (!gl || !program) return;

    var elapsed = (timestamp - startTime) / 1000;
    var animElapsed = timestamp - animStart;
    var animT = Math.min(animElapsed / animDuration, 1);

    if (progressTarget === 1) {
      progressCurrent = easeOpen(animT);
    } else {
      progressCurrent = 1 - easeClose(animT);
    }
    progressCurrent = Math.max(0, Math.min(1, progressCurrent));

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.progress, progressCurrent);
    gl.uniform2f(uniforms.origin, originX, originY);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Continuer ou arreter
    if (progressTarget === 0 && progressCurrent <= 0 && animT >= 1) {
      destroy();
      return;
    }

    animId = requestAnimationFrame(render);
  }

  function destroy() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    window.removeEventListener('resize', resize);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    if (gl && program) {
      gl.deleteProgram(program);
    }
    gl = null;
    program = null;
    canvas = null;
    active = false;
  }

  function getButtonOrigin(btn) {
    var rect = btn.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    // Normaliser en coordonnees UV (0-1), Y inverse pour WebGL
    originX = cx / window.innerWidth;
    originY = 1 - (cy / window.innerHeight);
  }

  function activate(btn) {
    getButtonOrigin(btn);
    buttonEl = btn;
    originalText = btn.textContent;
    btn.textContent = ACTIVE_TEXT;

    if (!canvas) {
      if (!initWebGL()) return;
    }

    startTime = performance.now();
    animStart = performance.now();
    animDuration = 5000;
    progressTarget = 1;
    progressCurrent = 0;
    active = true;

    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  }

  function deactivate() {
    if (buttonEl && originalText) {
      buttonEl.textContent = originalText;
    }
    animStart = performance.now();
    animDuration = 3000;
    progressTarget = 0;
  }

  function findButton() {
    var links = document.querySelectorAll('.wp-block-button__link');
    for (var i = 0; i < links.length; i++) {
      if (links[i].textContent.trim().toUpperCase().indexOf('LUMIERE') !== -1 ||
          links[i].textContent.trim().toUpperCase().indexOf('LUMIERE') !== -1) {
        return links[i];
      }
    }
    if (links.length > 0) return links[links.length - 1];
    return null;
  }

  function init() {
    var btn = findButton();
    if (!btn) return;

    btn.addEventListener('click', function(e) {
      var href = btn.getAttribute('href');
      if (!href || href === '#' || href === '') {
        e.preventDefault();
      }

      if (!active) {
        activate(btn);
      } else {
        deactivate();
      }
    });

    btn.style.position = 'relative';
    btn.style.zIndex = '10000';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
