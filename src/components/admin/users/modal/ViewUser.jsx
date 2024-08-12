import { Descriptions, Modal } from 'antd'
import React from 'react'
import { formatDate, formatText } from '../../../../utils/helpers'

const ViewUser = ({
    showViewModal , 
    setShowViewModal,
    userData
}) => {

    const descriptionItems = Object.entries(userData).map(([key , value]) => ({
        key : key === "created_at" ? "Onboarded On" : key,
        label : formatText(key),
        children : key === "created_at" ? (formatDate(new Date(value))) : value
    }))

  return (
    <Modal
        footer={null}
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        width={"50%"}
    >
        <div className='user-view-modal'>
            <h1>User Detail Modal</h1>
            <Descriptions
                bordered
                layout='vertical'
                items={descriptionItems}
                size='default'
            />
        </div>
    </Modal>
  )
}

export default ViewUser