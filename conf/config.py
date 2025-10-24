class param:
    def __init__(self):
        self.dataset = "ml-100k"
        self.data_path = "data/clean/"
        self.training_data = "/train.txt"
        self.val_data = "/val.txt"
        self.test_data = "/test.txt"

        self.model_name = "LightGCN"
        self.maxEpoch = 30
        self.batch_size = 2048
        self.emb_size = 64
        self.n_layers = 2
        self.reg = 1e-4
        self.lRate = 0.005
        self.dropout = True
        self.dropout_rate = 0.3
        self.cuda = True
        self.gpu_id = "0"
        self.seed = 2018
        self.topK = '50'

        self.load = False
        self.save = False
        self.save_dir = "./modelsaved/"
        
        # General parameters
        self.attackCategory = "Black"
        self.attackModelName = "RandomAttack"
        self.times = 1
        self.poisonDatasetOutPath = "data/poison"
        self.poisondataSaveFlag = False

        # Limitation parameters
        self.maliciousUserSize = 0.01
        self.maliciousFeedbackSize = 0

        # Bi-level attack parameters
        self.Epoch = 5
        self.innerEpoch = 6
        self.outerEpoch = 2

        # Gradient attack parameters
        self.gradMaxLimitation = 1
        self.gradNumLimitation = 60
        self.gradIterationNum = 10

        # Target attack parameters
        self.attackTargetChooseWay = "unpopular"
        self.targetSize = 5
        
    def update(self, opt):
        for key, value in opt.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
