
		MathJax.Hub.Config({
			skipStartupTypeset: true,
			jax: ["input/TeX", "output/SVG"],
			extensions: ["tex2jax.js", "toMathML.js"],
			TeX: {
				extensions: ["noUndefined.js", "autoload-all.js", "AMSmath.js", "AMSsymbols.js", "mediawiki-texvc.js"],
				mhchem: { legacy: false },
				Macros: { 
        R: '{\\mathbb{R}}', 
        N: '{\\mathbb{N}}', 
        Z: '{\\mathbb{Z}}', 
        C: '{\\mathbb{C}}', 
        F: '{\\mathbb{F}}', 
        e: '{\\varepsilon}',
        eps: '{\\varepsilon}', 
        argmin: '{\\mathop{\\operatorname*{arg\\,min}}}',
        argmax: '{\\mathop{\\operatorname*{arg\\,max}}}',
        mex: '{\\mathop{\\operatorname{mex}}}', 
        lcm: '{\\mathop{\\operatorname{lcm}}}',
        bigtriangleright: '{\\mathop{\\Large \\triangleright}}',
        bigtriangleleft: '{\\mathop{\\Large \\triangleleft}}',
        set: ['\\left\\{ #1 \\right\\}',1],
        floor: ['\\left\\lfloor #1 \\right\\rfloor',1],
        ceil:  ['\\left\\lceil #1 \\right\\rceil',1],
        abs:  ['\\left| #1 \\right|',1]
        }
			},
			SVG: {
				useGlobalCache: false,
				merrorStyle: {
					fontSize:"90%", color:"red", background:"",
      				border: "1px solid red", padding:"2px"
				},
				scale: 100, 
				minScaleAdjust: 80,
				blacker: 0,
				matchFontHeight: false
			},
			showProcessingMessages: false,
			tex2jax: {
				displayMath: [['$$\n', '\n$$'], ['$$\r\n', '\r\n$$']],
				inlineMath: [ ['$','$']],
				processEscapes: true,
				preview: "none",
				skipTags: ["script","noscript","style","textarea","pre","code", "span"],
				processClass: "md-inline-math|inline-math-export-jax"
			},
			menuSettings: {
				inTabOrder: false
			},
			showMathMenu: false,
			positionToHash: false
		});
		MathJax.Hub.processSectionDelay = 0;
		MathJax.Hub.processUpdateTime = 25;
		MathJax.Hub.processUpdateDelay = 0;
		MathJax.Hub.Queue(["setRenderer", MathJax.Hub, "SVG"]);
		MathJax.Hub.Register.StartupHook("TeX autoload-all Ready", function () {
		  var MACROS = MathJax.InputJax.TeX.Definitions.macros;
		  MACROS.color = "Color";
		  delete MACROS.colorbox;
		  delete MACROS.fcolorbox;
		});

