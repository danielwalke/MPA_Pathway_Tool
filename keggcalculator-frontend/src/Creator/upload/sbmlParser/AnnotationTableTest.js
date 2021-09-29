import React, {PureComponent} from "react";
import { FixedSizeList as List } from 'react-window';
import {useStyles} from "../../ModalStyles/ModalStyles";

class ItemRenderer extends PureComponent {
    render() {
        return (
            <div >
                Item {this.props.index}
            </div>
        );
    }
}



// Reference it inside of the render method:
class AnnotationTableTest extends React.Component {

    render() {
        return (
        <div style={{width: "80vw", height: "80vh", overflow: "auto", backgroundColor:"white"}}>
            <List height={300}
                  itemCount={20}
                  itemSize={40}
                  width={300}
                  >
                {ItemRenderer}
            </List>
        </div>
    )
    }
}

export default AnnotationTableTest
