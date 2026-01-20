import { useState } from "react";

const familyMember = [
  {
    id: 1,
    image: "../public/images/chingiz.jpg",
    name: "Chingiz",
    lastName: "Baidavletov",
    goals: [
      { id: 1, name: "headphones", price: 500, balance: 70 },
      { id: 2, name: "airpods", price: 250, balance: 60 },
      { id: 3, name: "hockey stick", price: 400, balance: 120 },
    ],
  },
  {
    id: 2,
    image: "../public/images/dana.jpg",
    name: "Dana",
    lastName: "Tazhenova",
    goals: [{ id: 1, name: "lv-bag", price: 500, balance: 90 }],
  },
  {
    id: 3,
    image: "../public/images/ariana.jpg",
    name: "Ariana",
    lastName: "Chingiz",
    goals: [
      { id: 1, name: "cat toy", price: 500, balance: 200 },
      { id: 2, name: "dog lego", price: 250, balance: 150 },
    ],
  },
];

export default function App() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [goal, setGoal] = useState(familyMember);

  function handleSelected(person) {
    setSelectedPerson((cur) => (cur?.id === person.id ? null : person));
  }

  function handleClose() {
    setIsOpen((show) => !show);
  }

  function handleAddGoal(newGoal) {
    setGoal((prev) =>
      prev.map((member) =>
        member.id === selectedPerson.id
          ? { ...member, goals: [...member.goals, newGoal] }
          : member,
      ),
    );
  }

  function handleAddBalance(personId, goalName, amount) {
    setGoal((prev) =>
      prev.map((member) =>
        member.id === personId
          ? {
              ...member,
              goals: member.goals.map((g) =>
                g.name === goalName ? { ...g, balance: g.balance + amount } : g,
              ),
            }
          : member,
      ),
    );
  }

  function deleteGoal(personId, goalId) {
    setGoal((prev) =>
      prev.map((member) =>
        member.id === personId
          ? { ...member, goals: member.goals.filter((g) => g.id !== goalId) }
          : member,
      ),
    );
  }

  const person = goal.find((m) => m.id === selectedPerson?.id);

  return (
    <div className="app">
      <div className="sidebar">
        <Logo />
        <FamilyList
          onSelected={handleSelected}
          selectedPerson={selectedPerson}
          goal={goal}
        />
        {isOpen && (
          <FormAddGoal
            onAddGoal={handleAddGoal}
            selectedPerson={selectedPerson}
          />
        )}

        <Button onClick={handleClose}>
          {isOpen ? "Close" : "Add a new goal"}
        </Button>
      </div>
      {selectedPerson && (
        <GoalsList
          person={person}
          onAddBalance={handleAddBalance}
          deleteGoal={deleteGoal}
        />
      )}
    </div>
  );
}

function Logo() {
  return (
    <header className="logo">
      <h2>Goal Calculator</h2>
    </header>
  );
}

function FamilyList({ onSelected, selectedPerson, goal }) {
  return (
    <ul>
      {goal.map((person) => (
        <Person
          person={person}
          key={person.name}
          onSelected={onSelected}
          selectedPerson={selectedPerson}
        />
      ))}
    </ul>
  );
}

function Person({ person, selectedPerson, onSelected }) {
  const isSelected = selectedPerson?.id === person.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img className="image" src={person.image} alt={person.name}></img>
      {person.goals.length === 0 ? (
        <p>I have no goals</p>
      ) : (
        <p>
          Goals: <strong>{person.goals.length}</strong>
        </p>
      )}
      <Button onClick={() => onSelected(person)}>
        {isSelected ? "Close" : "Select"}
      </Button>
      <h3>{person.name}</h3>
    </li>
  );
}

function FormAddGoal({ onAddGoal, selectedPerson }) {
  const [goalName, setGoalName] = useState("");
  const [goalPrice, setGoalPrice] = useState("");

  function handleSubmitGoal(e) {
    e.preventDefault();

    if (goalName === "" || goalPrice === "" || !selectedPerson) return;

    const newGoal = {
      id: crypto.randomUUID(),
      name: goalName,
      price: goalPrice,
      balance: 0,
    };
    onAddGoal(newGoal);
    setGoalName("");
    setGoalPrice("");
  }

  return (
    <form className="form-add-goal" onSubmit={handleSubmitGoal}>
      <label>What is your new goal?</label>
      <input
        type="text"
        value={goalName}
        placeholder="add your goal"
        onChange={(e) => setGoalName(e.target.value)}
      />

      <label>How much you need?</label>
      <input
        type="text"
        value={goalPrice}
        placeholder="add total price"
        onChange={(e) => setGoalPrice(Number(e.target.value))}
      />

      <Button>Add your goal</Button>
    </form>
  );
}

function GoalsList({ person, onAddBalance, deleteGoal }) {
  return (
    <div>
      {person.goals.map((goal) => (
        <Goal
          id={goal.id}
          name={goal.name}
          price={goal.price}
          key={goal.id}
          balance={goal.balance}
          onAddBalance={(amount) => onAddBalance(person.id, goal.name, amount)}
          deleteGoal={(goalId) => deleteGoal(person.id, goalId)}
        />
      ))}
    </div>
  );
}

function Goal({ name, price, balance, onAddBalance, deleteGoal, id }) {
  const [addMoney, setAddMoney] = useState("");

  function handleAddMoney(e) {
    e.preventDefault();

    if (!addMoney) return;

    onAddBalance(Number(addMoney));
    setAddMoney("");
  }

  function handlePlus(e) {
    e.preventDefault();
    setAddMoney((s) => Number(s + 1));
  }

  function handleMinus(e) {
    e.preventDefault();
    setAddMoney((s) => Number(s - 1));
  }

  const paid = price === balance;

  return (
    <form className="form-split-bill" onSubmit={handleAddMoney}>
      <h2>
        {!paid ? "⭐" : "✅"} {name}
      </h2>

      <label>How much you want to add</label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button type="button" onClick={handleMinus} className="add-substract">
          -
        </button>
        <input
          onChange={(e) => setAddMoney(Number(e.target.value))}
          type="number"
          style={{
            display: "flex",
            width: "100%",
            marginLeft: "5px",
            marginRight: "5px",
            color: "white",
            fontWeight: "bold",
          }}
          value={addMoney}
        />
        <button type="button" onClick={handlePlus} className="add-substract">
          +
        </button>
      </div>

      <label>You balance</label>
      <input type="text" disabled className="disabled" value={`$${balance}`} />

      <label>How much left</label>
      <input
        type="text"
        style={paid ? { color: "#76ff64" } : {}}
        disabled
        className="disabled"
        value={!paid ? `$${price - balance}` : "complete"}
      />

      <label>Total price</label>
      <input type="text" disabled className="disabled" value={`$${price}`} />

      {paid ? (
        <Button type="button" onClick={() => deleteGoal(id)}>
          Delete goal
        </Button>
      ) : (
        <Button>Add money</Button>
      )}
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
