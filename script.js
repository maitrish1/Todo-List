document.addEventListener('DOMContentLoaded', () => {
    let ul = document.querySelector('ul');
    let todo = document.getElementById('todo');
    let desc = document.getElementById('desc');
    let Todos = [];
    let form = document.querySelector('form');

    getTodos();

    // Add new Todo 
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            let temp = await axios.post('https://crudcrud.com/api/ac62f60e5f48442c87cd6824aef1d2d7/Todos', {
                todo: todo.value,
                desc: desc.value,
                done: "false"
            });
            let res = await temp;
            Toastify({
                text: "New todo added: " + todo.value,
                gravity: "top",
                position: 'right',
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } catch (err) {
            console.log(err);
        }
        todo.value = '';
        desc.value = '';
        getTodos();
    });

    async function getTodos() {
        ul.innerHTML = '';
        try {
            let temp = await axios.get('https://crudcrud.com/api/ac62f60e5f48442c87cd6824aef1d2d7/Todos');
            let res = await temp;
            Todos = res.data;
        } catch (err) {
            console.log(err);
        }
        Todos.map((each) => {
            let li = document.createElement('li');

            // done button
            let doneBtn = document.createElement('button');
            doneBtn.textContent = '✅';
            doneBtn.addEventListener('click', () => {
                markDone('done',each._id);
            });

            // undone button
            let undoneBtn = document.createElement('button');
            undoneBtn.textContent = '❌';
            undoneBtn.addEventListener('click', () => {
                markDone('undone',each._id);
            });

            li.textContent = `${each.todo} - ${each.desc} ${each.done==='true' ? '✅' : '❌'}`;
            li.appendChild(doneBtn);
            li.appendChild(undoneBtn);
            ul.appendChild(li);
        });
    }

    async function markDone(mark,id) {
        let todoItem = Todos.find(todo => todo._id === id);
        todoItem.done='true'
        let todo={
            todo:todoItem.todo,
            desc:todoItem.desc,
            done:mark==='done'?'true':'false'
        }
        try {
            let temp = await axios.put(`https://crudcrud.com/api/ac62f60e5f48442c87cd6824aef1d2d7/Todos/${id}`, todo);
            let res = await temp;
            console.log(res);
            Toastify({
                text: mark==="done"? "Todo marked done" : "Todo marked incomplete",
                gravity: "top",
                position: 'right',
                style: mark==="done"? {
                    background: "green",
                }:
                {
                    background: "red",
                }
            }).showToast();
            getTodos();
        } catch (err) {
            console.log(err);
        }
    }
});
