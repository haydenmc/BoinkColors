/// <reference path="../Definitions/boink.d.ts" />

class ColorBlock extends Component {
	public attachedCallback() {
		super.attachedCallback();
		
		// HACK: Bind our data context to our background-color style
		// (maybe Boink can make this automagic some day...)
		this.dataContext.value.hexValue.onValueChanged.subscribe((arg) => {
			this.colorChanged(arg.newValue);
		});
		this.colorChanged(this.dataContext.value.hexValue.value);
	}
	
	private colorChanged(newHexValue: string) {
		this.style.backgroundColor = "#" + newHexValue;
	}
}
Component.register('bc-colorblock', ColorBlock);
