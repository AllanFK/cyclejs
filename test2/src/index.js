import {run} from '@cycle/run'
import {div, button, h1, h4, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {App} from './app'
import xs from 'xstream'
import {html} from 'snabbdom-jsx';


function main(sources) {

  const getRandomUser$ = sources.DOM.select('.get').events('click')
    .map(() => {
      return {
        url: 'https://jsonplaceholder.typicode.com/users/4',
        category: 'users',
        method: 'GET'
      }
    })

  const user$ = sources.HTTP.select('users')
    .flatten()
    .map(res => res.body)
    .startWith(null)
    

  const vdom$ = user$.map(user => 
    <div>
      <button className="get">Get random user</button>
      {user !== null ? 
        <div>
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div>{user.website}</div>
        </div>
      : null}
    </div>
  )  
  

  return {
    DOM: vdom$,
    HTTP: getRandomUser$
  }

}

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver()
}

run(main, drivers)
