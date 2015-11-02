/// <reference path="../Definitions/boink.d.ts" />
/// <reference path="../Data/DataModel.ts" />
/// <reference path="../Data/ColorModel.ts" />

class Palette extends Component {
	public colorClicked: (color: Observable<ColorModel>) => void;

	public createdCallback() {
		super.createdCallback();
		this.colorClicked = (color: Observable<ColorModel>) => {
			if (this.parentComponent.dataContext.value instanceof DataModel) {
				(<DataModel> this.parentComponent.dataContext.value).selectedColor.value = color.value;
			}
		};
	}
}
Component.register("bc-palette", Palette);