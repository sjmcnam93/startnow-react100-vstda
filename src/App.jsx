import React, { Component } from 'react';

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      task: this.props.task,
      priority: this.props.priority,
    }

    this.liClassString = this.liClassString.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buildListItem = this.buildListItem.bind(this);
  }

  liClassString() {
    var cssClass = this.state.isEditing ? "toDoEdit" : "toDo";

    switch(this.state.priority) {
      case "1":
        return `list-group-item list-group-item-success ${cssClass}`;

      case "2":
        return `list-group-item list-group-item-warning ${cssClass}`;

      case "3":
        return `list-group-item list-group-item-danger ${cssClass}`;

      default:
        console.log("hit liClassString() switch default")
        return "";
    }
  }

  handleEditClick() { 
    this.setState({ isEditing: true }); 
  }

  handleSaveClick(event) { 
    event.preventDefault();
    this.setState({ isEditing: false }); 
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  buildListItem() {
    if(this.state.isEditing) {
      return (
        <li className={this.liClassString()}>
          <form onSubmit={this.handleSaveClick}>
              <div className="row">
                <label className="form-group font-weight-bold col-md-12">
                  Description
                  <textarea 
                    name="task" 
                    className="form-control update-todo-text" 
                    rows="3" 
                    value = {this.state.task}
                    onChange={this.handleInputChange}
                  ></textarea>
                </label>
              </div>

              <div className="row">
                <label className="form-group font-weight-bold col-md-6">
                  Priority

                  <select 
                    name="priority"
                    className="form-control update-todo-priority"
                    value={this.state.priority}
                    onChange={this.handleInputChange}
                  >
                    <option value="1">Low Priority</option>
                    <option value="2">Medium Priority</option>
                    <option value="3">High Priority</option>
                  </select>
                </label>
              </div>

              <div className="row" id="save-button">
                <button className="btn btn-success rounded update-todo" type="submit">Save</button>
              </div>
          </form>
        </li>
      );
    } else {
      return (
        <li className={this.liClassString()}>
          <span>
            <input type="checkbox" />
            {this.state.task} 
          </span>

          <span>
            <i className="edit fas fa-edit edit-todo" onClick={this.handleEditClick} ></i>
            <i className="delete fas fa-trash-alt delete-todo" onClick={this.props.handleDeleteClick}></i>
          </span>
        </li>
      );
    }
  }

  render() {
    return(this.buildListItem());
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      todoList: [],
      keyList: [],
      task: "",
      priority: 0
    }

    this.highID = 0;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getNewId = this.getNewId.bind(this);
  }

  componentWillMount() {
    const initialItem = <li key="0" className="list-group-item list-group-item-primary">
      <h5>Welcome to Very Simple Todo App!</h5>
      <p>Get started now by adding a new todo on the left.</p>
    </li>
    const myList = this.state.todoList;

    myList.push(initialItem);

    this.setState({ todoList: myList });
  }

  * getNewId() { yield (++this.highID).toString(); }


  addListItem(task, priority) {
    var keyName = this.getNewId().next().value
    const newListItem = (
      <ListItem
        key={keyName}
        keyCopy={keyName}
        task={this.state.task}
        priority={this.state.priority}
        handleDeleteClick={(keyName) => this.handleDeleteClick(keyName)}
      />);

    const myTodoList = this.highID == 1 ? [] : this.state.todoList;
    const myKeyList = this.state.keyList;

    myTodoList.push(newListItem);
    myKeyList.push(keyName);

    this.setState({
      todoList: myTodoList,
      keyList: myKeyList
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addListItem(this.state.task, this.state.priority);
  }

  handleChange(event) {
    this.setState({ [event.name.value]: event.target.value });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleDeleteClick(keyName) {
    var myTodoList = this.state.todoList;
    var myKeyList = this.state.keyList;

    var index = myKeyList.findIndex((key, keyName) => {key == keyName});
    
    myTodoList.splice(index -1, 1);
    myKeyList.splice(index -1, 1);

    this.setState({
      todoList: myTodoList,
      keyList: myKeyList
    })
  }

  render() {
    return (
      <div className='container'>

        {/* --TITLE BLOCK-- */}
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-light">Very Simple Todo App</h1>
            <tagline className="text-light">Track all of the things</tagline>
            <hr className="bg-white" />
          </div>
        </div>

        <div className="row">
          {/* --INPUT FORM-- */}
          <div className="col-md-4">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-header">Add New Todo</div>

                <div className="card-body row">
                  <label className="form-group font-weight-bold col-md-12">
                    I want to...

                    <textarea 
                      name="task" 
                      className="form-control create-todo-text" 
                      rows="3" 
                      value = {this.state.task}
                      onChange={this.handleInputChange}
                    ></textarea>
                  </label>

                  <label className="form-group font-weight-bold col-md-12">
                    How much of a priority is this?

                    <select 
                      name="priority"
                      className="form-control create-todo-priority"
                      value={this.state.priority}
                      onChange={this.handleInputChange}
                    >
                      <option value="0">Select a Priority</option>
                      <option value="1">Low Priority</option>
                      <option value="2">Medium Priority</option>
                      <option value="3">High Priority</option>
                    </select>
                  </label>
                </div>
                
                <div className="card-footer">
                  <button className="btn-block btn-success rounded create-todo" type="submit">Add</button>
                </div>
              </div>
            </form>
          </div>

          {/* --TODO LIST-- */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">View Todos</div>

              <ul className="list-group">
                  {this.state.todoList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
