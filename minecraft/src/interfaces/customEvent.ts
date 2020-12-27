interface CustomEvent extends Event{
  which: number;
  movementX: number;
  movementY: number;
}

export default CustomEvent;
