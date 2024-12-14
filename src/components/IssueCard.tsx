'use client';

import { Issue } from '@prisma/client';
import { Button, Card, ListGroup } from 'react-bootstrap/';
import { deleteIssue } from '@/lib/dbActions';

const IssueCard = ({ issue }: { issue : Issue }) => {
  const handleDelete = async () => {
    try {
      await deleteIssue({ id: issue.id });
      swal('Deleted', 'Location successfully deleted', 'success', { timer: 2000 });
    } catch (error) {
      swal('Error', 'Failed to delete the restaurant', 'error');
    }
  };

  return (
    <main>
      <Card className="h-100 mb-3">
        <Card.Header>
          <Card.Title>
            Topic:
            {' '}
            {issue.topic}
          </Card.Title>
          <Card.Subtitle>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Name:
                {' '}
                {issue.name || 'Anonymous'}
              </ListGroup.Item>
              <ListGroup.Item>
                Contact Info:
                {' '}
                {issue.contactinfo || 'Not Provided'}
              </ListGroup.Item>
              <ListGroup.Item>
                Description:
                {' '}
                {issue.description}
              </ListGroup.Item>
            </ListGroup>
          </Card.Subtitle>
        </Card.Header>
        <Card.Footer>
          Date Reported:
          {' '}
          {issue.createdAt.toLocaleDateString('en-US')}
          <Button variant="primary" onClick={handleDelete} className="float-end">Resolve</Button>
        </Card.Footer>
      </Card>
    </main>
  );
};

export default IssueCard;
