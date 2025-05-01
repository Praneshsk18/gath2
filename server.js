const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const sequelize =new Sequelize(
    "postgresql://neondb_owner:npg_UIq8ZV2kBGQc@ep-fragrant-surf-a1wuluaa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    {
        dialect:"postgres",
        dialectOptions:{
            ssl:{
                require:true,
                rejectUnauthorized:false
            }
        },
        logging:false,
    }
)

const user = sequelize.define("user",{
    id:{type:DataTypes.INTEGER,unique:true,primaryKey:true,allowNull:true},
    article_no:{type:DataTypes.STRING(255),allowNull:false},
    product_service:{type:DataTypes.TEXT,allowNull:false},
    in_price:{type:DataTypes.INTEGER,allowNull:false},
    price:{type:DataTypes.INTEGER,allowNull:false},
    unit:{type:DataTypes.STRING,allowNull:false},
    in_stock:{type:DataTypes.INTEGER,allowNull:false},
    description:{type:DataTypes.TEXT,allowNull:false}
},{
    tableName:'pricetag',
    timestamps:false
})

fastify.get('/',async (request,reply) => {
    const data =await user.findAll();
    reply.send(data);
})

fastify.post('/add', async (request, reply) => {
    try {
        const {
            id,
            article_no,
            product_service,
            in_price,
            price,
            unit,
            in_stock,
            description
        } = request.body;

        if (
            !id || !article_no || !product_service || in_price == null ||
            price == null || !unit || in_stock == null || !description
        ) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }

        const newUser = await user.create({
            id,
            article_no,
            product_service,
            in_price,
            price,
            unit,
            in_stock,
            description
        });

        return reply.code(201).send({ success: true, data: newUser });
    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Failed to insert record', details: err.message });
    }
});


const start = async () => {
    try{
        await fastify.register(cors,{
            origin:"*",
            credentials: true,
        })
        await sequelize.authenticate();
        console.log("Database Connected");
        await fastify.listen({port:3000,host:"0.0.0.0"});
    }
    catch(e){
console.log(e);
    }
}
start();
