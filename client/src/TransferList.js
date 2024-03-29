import React from 'react';

function TransferList({transfers, approveTransfer}) {

  return(
    <div>
      <h2> Transfers </h2>
      <table>
        <thead>
             <tr>
                <th>Id</th>
                <th>Amount</th>
                <th>To</th>
                <th>Approvals</th>
                <th>Sent</th>
              </tr>
        </thead>
        <tbody>{transfers.map(transfer => (
          <tr key={transfer.id}>
            <td>{transfer.id}</td>
            <td>{transfer.amount}</td>
            <td>{transfer.to}</td>
            <td>{transfer.approvals}</td>
            <td>
            <button onClick={() => approveTransfer(transfer.id)}>
              Approve</button>
            </td>
            <td>{transfer.sent ? 'yes': 'no'}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export default TransferList;