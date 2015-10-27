/// <reference path="../Definitions/boink.d.ts" />
/// <reference path="ColorModel.ts" />

class DataModel {
	public selectedColor: Observable<ColorModel>
		= new Observable<ColorModel>(new ColorModel());
	public palette: Observable<ObservableArray<ColorModel>>
		= new Observable<ObservableArray<ColorModel>>(new ObservableArray<ColorModel>());

	constructor() {
		var red = new ColorModel();
		red.hexValue.value = "ff0000";
		this.palette.value.push(red);
		
		var green = new ColorModel();
		green.hexValue.value = "00ff00";
		this.palette.value.push(green);
		
		var blue = new ColorModel();
		blue.hexValue.value = "0000ff";
		this.palette.value.push(blue);
	}
}