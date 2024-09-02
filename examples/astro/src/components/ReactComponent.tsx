import { useStore } from "lager/react";
import { counterStore } from "../stores/counter";
import { nameStore } from "../stores/name";
import { resourceStore } from "../stores/resource";

export default function ReactComponent() {
  const count = useStore(counterStore);
  const name = useStore(nameStore);
  const resourceValue = useStore(resourceStore.value);
  const resourceState = useStore(resourceStore.state);

  return (
    <fieldset>
      <legend>React Counter</legend>

      <p>Resource state: {resourceState}</p>
      <p>Resource value: {resourceValue}</p>

      <p id="count">{count}</p>
      <button onClick={() => counterStore.set(count + 1)}>Increment</button>
      <button onClick={() => counterStore.set(count - 1)}>Decrement</button>

      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => nameStore.set(e.target.value)}
      />
    </fieldset>
  );
}
