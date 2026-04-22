import React from 'react';
import { Typography, Avatar, Tag, Space, Divider, Button } from 'antd';
import { Author } from './types';
import { styles } from './SharedStyles';

const { Title, Paragraph, Text } = Typography;

interface Props {
  author: Author;
}

const TrangGioiThieu: React.FC<Props> = ({ author }) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, textAlign: 'center' }}>
        <Avatar size={120} src={author.avatar} style={{ border: '3px solid #D93523', marginBottom: 20 }} />
        <Title level={2}>{author.name}</Title>
        <div style={styles.badge}>Developer / Writer</div>

        <Paragraph style={{ fontSize: '16px', margin: '20px 0' }}>
          {author.bio}
        </Paragraph>

        <Divider>Kỹ năng</Divider>
        <Space wrap justifyContent="center">
          {author.skills.map(skill => (
            <Tag color="volcano" key={skill} style={{ fontSize: '14px', padding: '5px 10px' }}>
              {skill}
            </Tag>
          ))}
        </Space>

        <Divider>Mạng xã hội</Divider>
        <Space size="middle">
          {author.socialLinks.map(link => (
            <Button key={link.label} type="link" href={link.url} target="_blank">
              {link.label}
            </Button>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default TrangGioiThieu;