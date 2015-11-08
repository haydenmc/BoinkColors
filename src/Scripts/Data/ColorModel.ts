/// <reference path="../Definitions/boink.d.ts" />

/**
 * A model used to store a color.
 */
class ColorModel {
	/**
	 * The 'true value' for the color, stored as a hex string.
	 */
	public hexValue: Observable<string> = new Observable("000000");

	/**
	 * Red value of the color as a decimal number 0 - 255.
	 */
	public red: ObservableProxy<number, string>;

	/**
	 * Green value of the color as a decimal number 0 - 255.
	 */
	public green: ObservableProxy<number, string>;

	/**
	 * Blue value of the color as a decimal number 0 - 255.
	 */
	public blue: ObservableProxy<number, string>;

	/**
	 * Hue value of the color as a decimal number 0 - 1.
	 */
	public hue: ObservableProxy<number, string>;

	/**
	 * Saturation value of the color as a decimal number 0 - 1.
	 */
	public saturation: ObservableProxy<number, string>;

	/**
	 * Lightness value of the color as a decimal number 0 - 1.
	 */
	public lightness: ObservableProxy<number, string>;

	/**
	 * Constructs a new ColorModel
	 * @param {string?} hexValue The hex value of the color, black if unspecified.
	 */
	constructor(hexValue?: string) {
		if (typeof hexValue !== "undefined") {
			this.hexValue.value = hexValue;
		}

		// Set up the red proxy
		this.red = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			return parseInt(source.substr(0, 2), 16);
		}, (source: number, value: string) => {
			return ColorModel.componentToHex(source) + value.substr(2);
		});

		// Set up the green proxy
		this.green = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			return parseInt(source.substr(2, 2), 16);
		}, (source: number, value: string) => {
			return value.substr(0, 2) + ColorModel.componentToHex(source) + value.substr(4, 2);
		});

		// Set up the blue proxy
		this.blue = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			return parseInt(source.substr(4, 2), 16);
		}, (source: number, value: string) => {
			return value.substr(0, 4) + ColorModel.componentToHex(source)
		});

		// Set up the hue proxy
		this.hue = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			// TODO: Probably a way to calculate hue from RGB directly.
			var rgb = ColorModel.hexToRgb(source);
			return ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2])[0];
		}, (source: number, value: string) => {
			var rgb = ColorModel.hexToRgb(value);
			var hsl = ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2]);
			hsl[0] = source;
			rgb = ColorModel.hslToRgb(hsl[0]/360, hsl[1]/100, hsl[2]/100);
			return ColorModel.componentToHex(rgb[0])
				+ ColorModel.componentToHex(rgb[1])
				+ ColorModel.componentToHex(rgb[2]);
		});

		// Set up the saturation proxy
		this.saturation = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			// TODO: Probably a way to calculate hue from RGB directly.
			var rgb = ColorModel.hexToRgb(source);
			return ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2])[1];
		}, (source: number, value: string) => {
			var rgb = ColorModel.hexToRgb(value);
			var hsl = ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2]);
			hsl[1] = source;
			rgb = ColorModel.hslToRgb(hsl[0]/360, hsl[1]/100, hsl[2]/100);
			return ColorModel.componentToHex(rgb[0])
				+ ColorModel.componentToHex(rgb[1])
				+ ColorModel.componentToHex(rgb[2]);
		});

		// Set up the lightness proxy
		this.lightness = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			// TODO: Probably a way to calculate hue from RGB directly.
			var rgb = ColorModel.hexToRgb(source);
			return ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2])[2];
		}, (source: number, value: string) => {
			var rgb = ColorModel.hexToRgb(value);
			var hsl = ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2]);
			hsl[2] = source;
			rgb = ColorModel.hslToRgb(hsl[0]/360, hsl[1]/100, hsl[2]/100);
			return ColorModel.componentToHex(rgb[0])
				+ ColorModel.componentToHex(rgb[1])
				+ ColorModel.componentToHex(rgb[2]);
		});
	}

	/**
	 * Converts one component of RGB to hex
	 * @param {number} c Color component value, 0 - 255
	 */
	public static componentToHex(c: number): string {
		c = Math.round(c);
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	/**
	 * Returns RGB values given a hex color string.
	 * @param {string} hex The hex color value
	 * @returns {number[]} Array of R, G, B number values 0 - 255
	 */
	public static hexToRgb(hex: string): number[] {
		return [
			parseInt(hex.substr(0, 2), 16),
			parseInt(hex.substr(2, 2), 16),
			parseInt(hex.substr(4, 2), 16)
		];
	}

	/**
	 * Returns HSV given RGB.
	 * @param {number} r Red value out of 255
	 * @param {number} g Green value out of 255
	 * @param {number} b Blue value out of 255
	 * @returns {number[]} Array of hue (0 - 360), saturation (0 - 100), and lightness (0 - 100) values
	 */
	public static rgbToHsl(r: number, g: number, b: number): number[] {
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
		var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [ Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
	}

	/**
	* Converts an HSL color value to RGB. Conversion formula
	* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	* Assumes h, s, and l are contained in the set [0, 1] and
	* returns r, g, and b in the set [0, 255].
	*
	* @param   Number  h       The hue
	* @param   Number  s       The saturation
	* @param   Number  l       The lightness
	* @return  Array           The RGB representation
	*/
	public static hslToRgb(h, s, l){
		var r, g, b;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
}