/// <reference path="../Definitions/boink.d.ts" />

class ValueSlider extends Component {
	private beingManipulated: boolean;
	
	public createdCallback(): void {
		super.createdCallback();
		this.beingManipulated = false;
	}
	
	public attachedCallback(): void {
		super.attachedCallback();
		this.shadowRoot.querySelector("div.back").addEventListener("mousedown", (e) => {
			e.preventDefault();
			var size = ((e.screenX - this.getBoundingClientRect().left) / this.clientWidth) * 100;
			this.dataContext.value = (size / 100) * 360;
			this.changeSliderValue(size);
			this.beingManipulated = true;
		});
		
		this.shadowRoot.querySelector("div.back").addEventListener("mousemove", (e) => {
			e.preventDefault();
			if (this.beingManipulated) {
				(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.transition = "none";
				var size = ((e.screenX - this.getBoundingClientRect().left) / this.clientWidth) * 100;
				this.dataContext.value = (size / 100) * 360;
				this.changeSliderValue(size);
			}
		});
		
		document.addEventListener("mouseup", (e) => {
			this.beingManipulated = false;
			(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.removeProperty("transition");
		});
		
		this.dataBinder.registerBinding("").onValueChanged.subscribe((arg) => {
			this.changeSliderValue( (arg.valueChangedEvent.newValue / 360) * 100 );
		});
		this.changeSliderValue( (this.dataContext.value / 360) * 100 );
	}
	
	private changeSliderValue(size: number) {
		(<HTMLElement>this.shadowRoot.querySelector("div.front")).style.width = size + "%";
		
	}
}
Component.register("bc-valueslider", ValueSlider);