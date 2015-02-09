{div} = React.DOM

Hello = React.createClass
    render: ->
        (div {}, ['Hello ' + @props.name])

React.renderComponent (Hello {name: 'World'}), document.body
