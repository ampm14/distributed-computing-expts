import grpc
import power_pb2
import power_pb2_grpc
import time
import psutil
import os

def run(num_requests):
    # Connect to server
    channel = grpc.insecure_channel('localhost:50051')
    stub = power_pb2_grpc.PowerServiceStub(channel)

    # Sample single call
    x, y = 1729.0, 11.0  # Example: 2^3 = 8
    request = power_pb2.PowerRequest(x=x, y=y)
    response = stub.ComputePower(request)
    print(f"Single call: {x} ** {y} = {response.result}")

    # Performance measurement: Multiple requests
    process = psutil.Process(os.getpid())
    start_time = time.perf_counter()
    total_request_size = 0
    total_response_size = 0
    results = []
    
    for _ in range(num_requests):
        request = power_pb2.PowerRequest(x=x, y=y)
        request_size = len(request.SerializeToString())  # Bytes for request
        total_request_size += request_size
        
        response = stub.ComputePower(request)
        response_size = len(response.SerializeToString())  # Bytes for response
        total_response_size += response_size
        
        results.append(response.result)  # Collect to avoid optimization skips

    end_time = time.perf_counter()
    # Measure CPU with longer interval for better accuracy
    cpu_usage = process.cpu_percent(interval= 7.0)  # Wait 0.5s to capture usage

    total_time = end_time - start_time
    avg_latency = total_time / num_requests * 1000  # ms per request
    total_bandwidth = (total_request_size + total_response_size) / 1024  # Total KB
    avg_bandwidth_per_request = total_bandwidth / num_requests  # Avg KB per request

    print(f"Performance for {num_requests} requests:")
    print(f"Total execution time: {total_time:.4f} seconds")
    print(f"Average latency per request: {avg_latency:.4f} ms")
    print(f"Average CPU usage: {cpu_usage:.2f}%")
    print(f"Total bandwidth consumption: {total_bandwidth:.2f} KB (excl. ~100-200 bytes/call HTTP/2 headers)")
    print(f"Average bandwidth per request: {avg_bandwidth_per_request:.4f} KB")
    
    return total_time, avg_latency, cpu_usage, total_bandwidth, avg_bandwidth_per_request

if __name__ == '__main__':
    for num in [1000]:
        run(num_requests=num)