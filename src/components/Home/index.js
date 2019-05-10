import React, {Component} from 'react';

import { withFirebase } from '../Firebase'
import { withAuthorization } from '../Session';
import RoomList from '../Room';

const HomePage = () => (
  <div>
    <RoomList></RoomList>
    <hr/>
    <p className="m-3 text-muted text-sm">
    Các câu hỏi capcha sẽ được các bot gửi vào Room tương ứng. 
      Hãy gõ các mã capcha trong các Room để giúp bot mua Coin. 
      Điền càng nhanh thì xác xuất mua thành công càng lớn.
    </p>
  </div>
);


const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);