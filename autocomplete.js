const createAutoComplete = ({ 
    root,                       
    renderOption,               
    onOptionSelect,             
    inputValue,                 
    fetchData                   
 }) => {
        //create the dropdown element
        
        root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
        `;
        
        const input = root.querySelector('input');
        const dropdown = root.querySelector('.dropdown');
        const resultsWrapper = root.querySelector('.results');
        
        const onInput = async event => {
          const items = await fetchData(event.target.value);
          
        
                  //to close dropdown if the searchterm is removed
                  console.log(items);
                  console.log(items.length);

        if (items.length === 0) {
            resultsWrapper.innerHTML = "";        
            dropdown.classList.add("is-active");

            dropdown.classList.add("is-active");
            const option = document.createElement('a');
    
            option.classList.add("dropdown-item");
            option.innerHTML = option.innerHTML = `
            <img src="https://i.imgur.com/FlVWpST.png" />
            <h1>Sorry, not found!</h1>
            `;
            
            resultsWrapper.appendChild(option);
        } else {
                //to clear optionlist 
          resultsWrapper.innerHTML = "";        
          dropdown.classList.add("is-active");
                
                //show search results in dropdown
          for (let item of items) {
            const option = document.createElement('a');
            
            option.classList.add("dropdown-item");
            option.innerHTML = renderOption(item);
                //when a user clicks an option, update text in searchbar and close dropdown
                //then do a new request for data by ID to retrive all the info.
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                input.value = inputValue(item);
                onOptionSelect(item);
            });
            resultsWrapper.appendChild(option);
          }
        };
    };
        
        input.addEventListener('input', debounce(onInput, 800));

        document.addEventListener("click", event => {
            if (!root.contains(event.target)) {
                dropdown.classList.remove("is-active");
            }
        });
};