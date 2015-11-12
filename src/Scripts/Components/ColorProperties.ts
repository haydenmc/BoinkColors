/// <reference path="../Definitions/boink.d.ts" />
/// <reference path="../Data/ColorModel.ts" />

class ColorProperties extends Component {
	public attachedCallback(): void {
		super.attachedCallback();
		
		// Bind hex input
		var hexInput = <HTMLInputElement>this.shadowRoot.querySelector("input.hexValue");
		var hexInputBusy = false;
		this.dataBinder.registerBinding("hexValue").onValueChanged.subscribe((arg) => {
			if (!hexInputBusy) {
				hexInput.value = arg.valueChangedEvent.newValue;
			}
		});
		hexInput.addEventListener("input", (ev) => {
			hexInputBusy = true;
			(<ColorModel>this.dataContext.value).hexValue.value = hexInput.value;
			hexInputBusy = false;
		});
		hexInput.value = this.dataContext.value.hexValue.value;
	}
	
	public addClick() {
		console.log("Click!");
		var newColor = new ColorModel(this.dataContext.value.hexValue.value);
		this.dataContext.value = newColor;
		this.parentComponent.dataContext.value.palette.value.push(newColor);
	}
}
Component.register("bc-colorproperties", ColorProperties);
