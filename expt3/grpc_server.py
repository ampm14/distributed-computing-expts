import grpc
from concurrent import futures
import power_pb2
import power_pb2_grpc

class PowerServiceServicer(power_pb2_grpc.PowerServiceServicer):
    def ComputePower(self, request, context):
        try:
            result = request.x ** request.y
        except ZeroDivisionError:
            result = 0.0  # Handle cases like 0 ** negative
        return power_pb2.PowerResponse(result=result)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    power_pb2_grpc.add_PowerServiceServicer_to_server(PowerServiceServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("gRPC Server running on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()