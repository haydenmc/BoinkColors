declare class EventHandler<T> {
    private callbacks;
    constructor();
    subscribe(callback: (arg: T) => void): void;
    unSubscribe(callback: (arg: T) => void): void;
    unSubscribeAll(): void;
    fire(arg: T): void;
}
declare class Observable<T> {
    private _value;
    value: T;
    private _onValueChanged;
    onValueChanged: EventHandler<ValueChangedEvent<T>>;
    constructor(defaultValue?: T);
}
interface ValueChangedEvent<T> {
    oldValue: T;
    newValue: T;
}
declare class DataBinding {
    dataContext: Observable<any>;
    path: string;
    property: string;
    childBindings: {
        [property: string]: DataBinding;
    };
    private updateCallback;
    onValueChanged: EventHandler<DataBindingValueChangedEvent>;
    value: any;
    constructor(path: string, dataContext: Observable<any>);
    reattachChildren(binding?: DataBinding): void;
    reattachBinding(): void;
    attachBinding(): void;
    detachBinding(dataContext?: Observable<any>): void;
    releaseListeners(): void;
}
declare class DataBindingValueChangedEvent {
    path: string;
    valueChangedEvent: ValueChangedEvent<any>;
}
declare class NodeBinding {
    node: Node;
    bindings: DataBinding[];
    private originalValue;
    updateCallback: (args) => void;
    constructor(node: Node, bindings: DataBinding[]);
    updateNode(): void;
}
declare class DataBinder {
    static bindingRegex: RegExp;
    protected bindingTree: DataBinding;
    protected nodeBindings: NodeBinding[];
    private _dataContext;
    dataContext: Observable<any>;
    constructor(dataContext?: Observable<any>);
    parseBindings(str: string): string[];
    bindNodes(node: Node): void;
    registerBinding(path: string): DataBinding;
    removeAllBindings(binding?: DataBinding): void;
    static resolvePropertyPath(path: string, dataContext: Observable<any>): Observable<any>;
}
declare class Component extends HTMLElement {
    protected shadowRoot: any;
    protected _dataContext: Observable<any>;
    dataContext: Observable<any>;
    parentComponent: Component;
    protected dataBinder: DataBinder;
    constructor();
    static register(elementName: string, theClass: any): void;
    createdCallback(): void;
    attachedCallback(): void;
    protected processDataContextAttributeBinding(): void;
    protected applyShadowTemplate(): void;
    protected processEventBindings(node: Node): void;
    protected applyMyDataContext(node: Node, dataContext?: Observable<any>): void;
    protected setParentComponent(node: Node, component?: Component): void;
    detachedCallback(): void;
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void;
}
declare class Application extends Component {
    static instance: any;
    createdCallback(): void;
}
declare class Page extends Component {
    private contentNodes;
    createdCallback(): void;
    attachedCallback(): void;
    show(): void;
    hide(): void;
}
declare class Frame extends Component {
    private currentPage;
    createdCallback(): void;
    attachedCallback(): void;
    navigateTo(page: Page): void;
    navigateToId(pageId: string): void;
    notifyPageLoaded(pageId: string): void;
}
interface ObservableArrayEventArgs<T> {
    item: T;
    position: number;
}
declare class ObservableArray<T> {
    itemAdded: EventHandler<ObservableArrayEventArgs<T>>;
    itemRemoved: EventHandler<ObservableArrayEventArgs<T>>;
    size: number;
    private itemStore;
    constructor();
    push(item: T): void;
    insert(item: T, index: number): void;
    get(index: number): T;
    remove(item: T): void;
    removeAt(index: number): void;
    indexOf(item: T): number;
}
declare class Repeater extends Component {
    private template;
    private repeaterItems;
    private itemEventCallbacks;
    createdCallback(): void;
    attachedCallback(): void;
    protected processEventBindings(node: Node): void;
    dataContextUpdated(): void;
    itemAdded(arg: ObservableArrayEventArgs<any>): void;
    itemRemoved(arg: ObservableArrayEventArgs<any>): void;
    private populateAllItems();
    private addItem(dataContext, position?);
    private removeItem(position);
    private clearItems();
    private applyRepeaterEvents(node, dataContext);
}
interface RepeaterItem {
    dataContext: Observable<any>;
    dataBinder: DataBinder;
    nodes: Node[];
}
