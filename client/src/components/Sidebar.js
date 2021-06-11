import { ListGroup } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';



function Sidebar(props) {

    return (
        <ListGroup as="aside" variant="flush">
            <NavLink to={'/'} className="list-group-item list-group-item-action" activeClassName="list-group-item active">Surveys</NavLink>
        </ListGroup>
    );
}

export default Sidebar;
