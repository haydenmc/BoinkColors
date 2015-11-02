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
			return "000000";
		});

		// Set up the saturation proxy
		this.saturation = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			// TODO: Probably a way to calculate hue from RGB directly.
			var rgb = ColorModel.hexToRgb(source);
			return ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2])[1];
		}, (source: number, value: string) => {
			return "000000";
		});

		// Set up the lightness proxy
		this.lightness = new ObservableProxy<number, string>(this.hexValue, (source: string) => {
			// TODO: Probably a way to calculate hue from RGB directly.
			var rgb = ColorModel.hexToRgb(source);
			return ColorModel.rgbToHsl(rgb[0], rgb[1], rgb[2])[2];
		}, (source: number, value: string) => {
			return "000000";
		});
	}

	/**
	 * Converts one component of RGB to hex
	 * @param {number} c Color component value, 0 - 255
	 */
	public static componentToHex(c: number): string {
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
	 * @returns {number[]} Array of hue, saturation, and lightness values
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

		return [h, s, l];
	}
}