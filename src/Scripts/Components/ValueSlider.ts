/// <reference path="../Definitions/boink.d.ts" />

class ValueSlider extends Component {
	private beingManipulated: boolean;
	private maxValue: number;
	
	public createdCallback(): void {
		super.createdCallback();
		this.beingManipulated = false;
		this.maxValue = 100; // Default to 100
	}
	
	public attachedCallback(): void {
		super.attachedCallback();
		// Get max value from attribute
		if (this.attributes.getNamedItem("data-max")) {
			this.maxValue = parseInt(this.attributes.getNamedItem("data-max").value);
		}
		// Add event listeners
		this.shadowRoot.querySelector("div.back").addEventListener("mousedown", (e) => {
			e.preventDefault();
			var newValue = ((e.clientX - this.getBoundingClientRect().left) / this.clientWidth) * this.maxValue;
			this.dataContext.value = newValue;
			this.changeSliderValue(newValue);
			this.beingManipulated = true;
		});
		document.addEventListener("mousemove", (e) => {
			e.preventDefault();
			if (this.beingManipulated) {
				(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.transition = "none";
				var newValue = ((e.clientX - this.getBoundingClientRect().left) / this.clientWidth) * this.maxValue;
				if (newValue < 0) {
					newValue = 0;
				} else if (newValue > this.maxValue) {
					newValue = this.maxValue;
				}
				this.dataContext.value = newValue;
				this.changeSliderValue(newValue);
			}
		});
		document.addEventListener("mouseup", (e) => {
			this.beingManipulated = false;
			(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.removeProperty("transition");
		});
		// Register data binding
		this.dataBinder.registerBinding("").onValueChanged.subscribe((arg) => {
			this.changeSliderValue( arg.valueChangedEvent.newValue );
		});
		this.changeSliderValue(this.dataContext.value);
	}
	
	private changeSliderValue(value: number) {
		(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.width = ((value / this.maxValue) * 100) + "%";
	}
}
Component.register("bc-valueslider", ValueSlider);