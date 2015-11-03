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
		
		// Bind sliders
		var sliders = ["red", "green", "blue"];
		for (var i = 0; i < sliders.length; i++) {
			var slider = sliders[i];
			((slider) => {
				var sliderElement = <HTMLInputElement>this.shadowRoot.querySelector("input." + slider);
				this.dataBinder.registerBinding(slider).onValueChanged.subscribe((arg) => {
					sliderElement.value = arg.valueChangedEvent.newValue;
				});
				sliderElement.addEventListener("change", (ev) => {
					(<ColorModel>this.dataContext.value)[slider].value = parseInt(sliderElement.value);
				});
				sliderElement.addEventListener("input", (ev) => {
					(<ColorModel>this.dataContext.value)[slider].value = parseInt(sliderElement.value);
				});
				sliderElement.value = this.dataContext.value[slider].value;
			})(slider);
		}
	}
}
Component.register("bc-colorproperties", ColorProperties);
